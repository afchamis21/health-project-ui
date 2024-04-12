import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Workspace} from "../../../../../../core/types/workspace";
import {WorkspaceMember} from "../../../../../../core/types/workspace-member";
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
import {
  WorkspaceMemberStateService
} from "../../../../../../core/services/workspace/member/workspace-member-state.service";
import {WorkspaceMemberService} from "../../../../../../core/services/workspace/member/workspace-member.service";
import {UserStateService} from "../../../../../../core/services/user/user-state.service";

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
  @Input() workspace!: Workspace
  members: WorkspaceMember[] = []


  user: User | null = null

  subscriptions: Subscription[] = []

  isOwner = false;

  paginationData: PaginationData;

  isLoadingMembers = false;

  constructor(
    private workspaceMemberService: WorkspaceMemberService,
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private workspaceMemberStateService: WorkspaceMemberStateService,
    private userStateService: UserStateService
  ) {
    this.paginationData = this.workspaceMemberStateService.getPaginationData()
  }

  ngOnInit(): void {
    const memberSubscription = this.workspaceMemberStateService.members$.subscribe({
      next: data => {
        this.members = data
      }
    })

    const isLoadingSubscription = this.workspaceMemberStateService.isLoading$.subscribe({
      next: (data) => {
        this.isLoadingMembers = data
      }
    })

    const userSubscription = this.userStateService.user$.subscribe(value => {
      this.user = value
      this.isOwner = value?.userId === this.workspace.ownerId
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

  addMemberToWorkspace() {
    const dialogRef = this.dialog.open(AddMemberDialogComponent)

    dialogRef.afterClosed().subscribe((value: AddMemberDialogReturn) => {
      if (value.complete) {
        this.workspaceMemberService.addMember(this.workspace.workspaceId, {
          email: value.value.email
        }).subscribe({
          next: (data) => {
            this.workspaceMemberStateService.fetchMembers()
            this.workspaceMemberStateService.addMemberName({
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
    this.workspaceMemberService.deactivateMember(this.workspace.workspaceId, memberId).subscribe({
      next: () => {
        this.workspaceMemberStateService.members$ = this.members.map(member => {
          if (member.user.userId === memberId) {
            member.isMemberActive = false
          }

          return member
        })
      }
    })
  }

  activateMember(memberId: number) {
    this.workspaceMemberService.activateMember(this.workspace.workspaceId, memberId).subscribe({
      next: () => {
        this.workspaceMemberStateService.members$ = this.members.map(member => {
          if (member.user.userId === memberId) {
            member.isMemberActive = true
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

    this.workspaceMemberStateService.fetchMembers()
  }
}
