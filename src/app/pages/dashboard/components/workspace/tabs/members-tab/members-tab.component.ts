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
import {PageControllerComponent} from "../../../../../../shared/components/page-controller/page-controller.component";
import {CollaboratorStateService} from "../../../../../../core/services/patient/member/collaborator-state.service";
import {CollaboratorService} from "../../../../../../core/services/patient/member/collaborator.service";
import {UserStateService} from "../../../../../../core/services/user/user-state.service";
import {PatientSummary} from "../../../../../../core/types/patient";
import {NgxSpinnerComponent, NgxSpinnerService} from "ngx-spinner";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-members-tab',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    MatIconModule,
    NgClass,
    PageControllerComponent,
    NgxSpinnerComponent,
    FormsModule
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

  isEditingCollaboratorMap: Record<number, boolean> = {}

  constructor(
    private collaboratorService: CollaboratorService,
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private collaboratorStateService: CollaboratorStateService,
    private userStateService: UserStateService,
    private spinner: NgxSpinnerService
  ) {
    this.paginationData = this.collaboratorStateService.getPaginationData()
  }

  ngOnInit(): void {
    const memberSubscription = this.collaboratorStateService.members$.subscribe({
      next: (data: Collaborator[]) => {
        this.members = data.sort((a, b) => {
          if (b.user.userId === this.patientSummary.ownerId) {
            return 1;
          }

          if (a.user.userId === this.patientSummary.ownerId) {
            return -1;
          }

          if (b.isCollaboratorActive) {
            if (a.isCollaboratorActive) {
              return 0
            }
            return 1
          }

          return -1
        })

        this.members.forEach(m => {
          this.isEditingCollaboratorMap[m.user.userId] = false
        })
      }
    })

    const isLoadingSubscription = this.collaboratorStateService.isLoading$.subscribe({
      next: (data) => {
        this.isLoadingMembers = data
        if (data) {
          this.spinner.show()
        } else {
          this.spinner.hide()
        }
      }
    })

    const userSubscription = this.userStateService.user$.subscribe(value => {
      this.user = value
      this.isOwner = value?.userId === this.patientSummary.ownerId
    })


    this.subscriptions.push(userSubscription, memberSubscription, isLoadingSubscription)
  }

  ngOnDestroy(): void {
    this.spinner.hide()
    SubscriptionUtils.unsubscribe(this.subscriptions)

    this.collaboratorStateService.setLoading(false)
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
        this.collaboratorStateService.setLoading(true)
        this.userService.addCollaboratorToPatient({
          email: value.value.email,
          patientId: this.patientSummary.patientId,
          description: value.value.description
        }).subscribe({
          next: (data) => {
            this.collaboratorStateService.fetchMembers()
            this.collaboratorStateService.addMemberName({
              userId: data.body.user.userId,
              username: data.body.user.username
            })

            this.toastr.success("Colaborador adicionado com sucesso!")
          },
          error: () => {
            this.collaboratorStateService.setLoading(false)
          }
        })
      }
    })
  }

  deactivateMember(memberId: number) {
    this.collaboratorStateService.setLoading(true)
    this.collaboratorService.deactivateMember(this.patientSummary.patientId, memberId).subscribe({
      next: () => {
        this.collaboratorStateService.setLoading(false)
        this.collaboratorStateService.members$ = this.members.map(member => {
          if (member.user.userId === memberId) {
            member.isCollaboratorActive = false
            this.toastr.info("Colaborador desativado com sucesso!")
          }

          return member
        })
      },
      error: () => {
        this.collaboratorStateService.setLoading(false)
      }
    })
  }

  activateMember(memberId: number) {
    this.collaboratorStateService.setLoading(true)
    this.collaboratorService.activateMember(this.patientSummary.patientId, memberId).subscribe({
      next: () => {
        this.collaboratorStateService.setLoading(false)
        this.collaboratorStateService.members$ = this.members.map(member => {
          if (member.user.userId === memberId) {
            member.isCollaboratorActive = true
            this.toastr.info("Colaborador ativado com sucesso!")
          }

          return member
        })
      },
      error: () => {
        this.collaboratorStateService.setLoading(false)
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
  
  handleEditMember(collaboratorId: number) {
    this.isEditingCollaboratorMap[collaboratorId] = true
  }

  handleUpdateMember(collaborator: Collaborator) {
    this.spinner.show()
    this.userService.updateCollaborator({
      description: collaborator.description,
      patientId: collaborator.patientId,
      userId: collaborator.user.userId
    }).subscribe({
      next: () => {
        this.toastr.success("Dados do colaborador atualizados com sucesso!")
        this.spinner.hide()
        this.isEditingCollaboratorMap[collaborator.user.userId] = false
      },
      error: () => {
        this.spinner.hide()
        this.isEditingCollaboratorMap[collaborator.user.userId] = false
      }
    })
  }

  cancelUpdateMember(collaboratorId: number) {
    this.isEditingCollaboratorMap[collaboratorId] = false
  }
}
