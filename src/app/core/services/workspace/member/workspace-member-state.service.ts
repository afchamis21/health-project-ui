import {Injectable} from '@angular/core';
import {WorkspaceStateService} from "../workspace-state.service";
import {BehaviorSubject, Observable} from "rxjs";
import {WorkspaceMember, WorkspaceMemberName} from "../../../types/workspace-member";
import {PaginationData} from "../../../types/http";
import {WorkspaceMemberService} from "./workspace-member.service";
import {Workspace} from "../../../types/workspace";
import {User} from '../../../types/user';
import {UserStateService} from "../../user/user-state.service";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceMemberStateService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable()
  }

  private membersSubject = new BehaviorSubject<WorkspaceMember[]>([])

  get members$(): Observable<WorkspaceMember[]> {
    return this.membersSubject.asObservable();
  }

  set members$(members: WorkspaceMember[]) {
    this.membersSubject.next(members);
  }

  private memberNamesSubject = new BehaviorSubject<WorkspaceMemberName[]>([]);

  get memberNames$(): Observable<WorkspaceMemberName[]> {
    return this.memberNamesSubject.asObservable()
  }

  private user: User | null = null;

  addMemberName(member: WorkspaceMemberName): void {
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

  private workspace: Workspace | null = null;

  constructor(workspaceStateService: WorkspaceStateService, private workspaceMemberService: WorkspaceMemberService,
              private userStateService: UserStateService) {
    workspaceStateService.workspace$.subscribe(workspace => {
      this.workspace = workspace
      this.resetState()
    })

    userStateService.user$.subscribe(user => {
      this.user = user
    })
  }

  private resetState() {
    if (this.workspace) {
      this.fetchMembers()

      if (this.user && this.user.userId === this.workspace.workspaceId) {
        this.fetchAllMemberUsernames()
      }
    } else {
      this.membersSubject.next([])
      this.memberNamesSubject.next([])
      this.paginationData.page = 0;
    }
  }

  fetchMembers() {
    if (!this.workspace) {
      return
    }

    this.loadingSubject.next(true);
    const sub = this.workspaceMemberService.getMembers(this.workspace.workspaceId, this.paginationData).subscribe({
      next: (value) => {
        this.loadingSubject.next(false);

        this.membersSubject.next(value.body.data)
        this.paginationData.lastPage = value.body.lastPage

        sub.unsubscribe()
      }
    })
  }

  fetchAllMemberUsernames() {
    if (!this.workspace) {
      return
    }

    const sub = this.workspaceMemberService.getMembersNames(this.workspace.workspaceId).subscribe({
      next: (data) => {
        this.memberNamesSubject.next(data.body)
        sub.unsubscribe()
      }
    })
  }
}
