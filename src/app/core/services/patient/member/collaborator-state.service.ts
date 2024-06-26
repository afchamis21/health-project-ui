import {Injectable} from '@angular/core';
import {PatientStateService} from "../patient-state.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Collaborator, PatientCollaboratorName} from "../../../types/collaborator";
import {PaginationData} from "../../../types/http";
import {CollaboratorService} from "./collaborator.service";
import {UserStateService} from "../../user/user-state.service";
import {PatientSummary} from "../../../types/patient";

@Injectable({
  providedIn: 'root'
})
export class CollaboratorStateService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable()
  }

  private membersSubject = new BehaviorSubject<Collaborator[]>([])

  get members$(): Observable<Collaborator[]> {
    return this.membersSubject.asObservable();
  }

  set members$(members: Collaborator[]) {
    this.membersSubject.next(members);
  }

  private memberNamesSubject = new BehaviorSubject<PatientCollaboratorName[]>([]);

  get memberNames$(): Observable<PatientCollaboratorName[]> {
    return this.memberNamesSubject.asObservable()
  }

  addMemberName(member: PatientCollaboratorName): void {
    this.memberNamesSubject.next([
      ...this.memberNamesSubject.value,
      member
    ])
  }

  private paginationData: PaginationData = {
    page: 0,
    size: 10,
    lastPage: 0,
    maxPages: 5,
    sort: "ASC"
  }

  getPaginationData(): PaginationData {
    return this.paginationData;
  }

  private patientSummary: PatientSummary | null = null;

  constructor(patientStateService: PatientStateService, private collaboratorService: CollaboratorService,
              private userStateService: UserStateService) {
    patientStateService.patientSummary$.subscribe(value => {
      this.patientSummary = value
      this.resetState()
    })
  }

  private resetState() {
    if (this.patientSummary) {
      this.fetchMembers()

      const user = this.userStateService.currentUserValue
      if (user && user.userId === this.patientSummary.ownerId) {
        console.log("Entrou aqui")
        this.fetchAllMemberUsernames()
      }
    } else {
      this.membersSubject.next([])
      this.memberNamesSubject.next([])
      this.paginationData.page = 0;
    }
  }

  fetchMembers() {
    if (!this.patientSummary) {
      return
    }

    this.loadingSubject.next(true);
    const sub = this.collaboratorService.getMembers(this.patientSummary.patientId, this.paginationData).subscribe({
      next: (value) => {
        this.loadingSubject.next(false);

        this.membersSubject.next(value.body.data)
        this.paginationData.lastPage = value.body.lastPage

        sub.unsubscribe()
      }
    })
  }

  fetchAllMemberUsernames() {
    if (!this.patientSummary) {
      return
    }
    console.log("Buscando nomes")
    const sub = this.collaboratorService.getMembersNames(this.patientSummary.patientId).subscribe({
      next: (data) => {
        console.log("Resultado", data.body)
        this.memberNamesSubject.next(data.body)
        sub.unsubscribe()
      }
    })
  }
}
