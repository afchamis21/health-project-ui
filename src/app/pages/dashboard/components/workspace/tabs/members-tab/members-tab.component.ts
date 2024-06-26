import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Collaborator} from "../../../../../../core/types/collaborator";
import {User} from "../../../../../../core/types/user";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../../../../../shared/utils/subscription-utils";
import {UserService} from "../../../../../../core/services/user/user.service";
import {PaginationData} from "../../../../../../core/types/http";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {AddMemberDialogComponent, AddMemberDialogReturn} from "./add-member-dialog/add-member-dialog.component";
import {ToastrService} from "ngx-toastr";
import {SpinnerComponent} from "../../../../../../shared/components/loader/spinner/spinner.component";
import {PageControllerComponent} from "../../../../../../shared/components/page-controller/page-controller.component";
import {CollaboratorStateService} from "../../../../../../core/services/patient/member/collaborator-state.service";
import {CollaboratorService} from "../../../../../../core/services/patient/member/collaborator.service";
import {UserStateService} from "../../../../../../core/services/user/user-state.service";
import {PatientSummary} from "../../../../../../core/types/patient";

@Component({
  selector: 'app-members-tab',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatIconModule,
    SpinnerComponent,
    NgClass,
    PageControllerComponent
  ],
  templateUrl: './members-tab.component.html',
  styleUrl: './members-tab.component.css'
})
export class MembersTabComponent implements OnInit, OnDestroy, OnChanges {
  @Input() patientSummary!: PatientSummary
  members: Collaborator[] = []


  user: User | null = null

  subscriptions: Subscription[] = []

  isOwner = false;

  paginationData: PaginationData;

  isLoadingMembers = false;

  constructor(
    private collaboratorService: CollaboratorService,
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private collaboratorStateService: CollaboratorStateService,
    private userStateService: UserStateService
  ) {
    this.paginationData = this.collaboratorStateService.getPaginationData()
  }

  ngOnInit(): void {
    const memberSubscription = this.collaboratorStateService.members$.subscribe({
      next: data => {
        this.members = data
      }
    })

    const isLoadingSubscription = this.collaboratorStateService.isLoading$.subscribe({
      next: (data) => {
        this.isLoadingMembers = data
      }
    })

    const userSubscription = this.userStateService.user$.subscribe(value => {
      this.user = value
      this.isOwner = value?.userId === this.patientSummary.ownerId
    })


    this.subscriptions.push(userSubscription, memberSubscription, isLoadingSubscription)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['members'] && !changes['members'].firstChange) {
      this.members = changes['members'].currentValue
    }
  }

  addCollaboratorToPatient() {
    const dialogRef = this.dialog.open(AddMemberDialogComponent)

    dialogRef.afterClosed().subscribe((value: AddMemberDialogReturn) => {
      if (value.complete) {
        this.userService.addCollaboratorToPatient({
          email: value.value.email,
          patientId: this.patientSummary.patientId
        }).subscribe({
          next: (data) => {
            this.collaboratorStateService.fetchMembers()
            this.collaboratorStateService.addMemberName({
              userId: data.body.user.userId,
              username: data.body.user.username
            })

            this.toastr.success("Colaborador adicionado com sucesso!")
          }
        })
      }
    })
  }

  deactivateMember(memberId: number) {
    this.collaboratorService.deactivateMember(this.patientSummary.patientId, memberId).subscribe({
      next: () => {
        this.collaboratorStateService.members$ = this.members.map(member => {
          if (member.user.userId === memberId) {
            member.isMemberActive = false
            this.toastr.info("Colaborador desativado com sucesso!")
          }

          return member
        })
      }
    })
  }

  activateMember(memberId: number) {
    this.collaboratorService.activateMember(this.patientSummary.patientId, memberId).subscribe({
      next: () => {
        this.collaboratorStateService.members$ = this.members.map(member => {
          if (member.user.userId === memberId) {
            member.isMemberActive = true
            this.toastr.info("Colaborador ativado com sucesso!")
          }

          return member
        })
      }
    })
  }

  handleNextPage() {
    this.handleSpecificPage(this.paginationData.page + 1)
  }

  handlePreviousPage() {
    this.handleSpecificPage(this.paginationData.page - 1)
  }

  handleSpecificPage(page: number) {
    this.paginationData.page = page

    this.collaboratorStateService.fetchMembers()
  }
}
