import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Workspace} from "../../../../core/types/workspace";
import {WorkspaceStateService} from "../../../../core/services/workspace-state.service";
import {NgClass} from "@angular/common";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../../../shared/utils/subscription-utils";

@Component({
  selector: 'app-workspace-card',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './workspace-card.component.html',
  styleUrl: './workspace-card.component.css'
})
export class WorkspaceCardComponent implements OnInit, OnDestroy {
  @Input() workspace!: Workspace
  isSelected = false

  subscriptions: Subscription[] = []

  constructor(private workspaceStateService: WorkspaceStateService) {
  }

  selectWorkspace() {
    this.workspaceStateService.selectWorkspace(this.workspace)
  }

  ngOnInit(): void {
    const isActiveSubscription = this.workspaceStateService.workspace$.subscribe((workspace) => {
      this.isSelected = workspace?.workspaceId === this.workspace.workspaceId
    })

    this.subscriptions.push(isActiveSubscription)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }
}
