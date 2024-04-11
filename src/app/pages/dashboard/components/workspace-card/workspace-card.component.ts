import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Workspace} from "../../../../core/types/workspace";
import {WorkspaceStateService} from "../../../../core/services/workspace/workspace-state.service";
import {NgClass, NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../../../shared/utils/subscription-utils";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-workspace-card',
  standalone: true,
  imports: [
    NgClass,
    MatIconModule,
    NgIf
  ],
  templateUrl: './workspace-card.component.html',
  styleUrl: './workspace-card.component.css'
})
export class WorkspaceCardComponent implements OnInit, OnDestroy {
  @Input() workspace!: Workspace
  @Input() isOpen!: boolean

  isSelected = false

  subscriptions: Subscription[] = []

  abbreviatedName = ''

  constructor(private workspaceStateService: WorkspaceStateService) {
  }

  selectWorkspace() {
    this.workspaceStateService.selectWorkspace(this.workspace.workspaceId)
  }

  ngOnInit(): void {
    const isActiveSubscription = this.workspaceStateService.workspace$.subscribe((workspace) => {
      this.isSelected = workspace?.workspaceId === this.workspace.workspaceId
    })

    this.subscriptions.push(isActiveSubscription)

    this.abbreviatedName = this.workspace.name.split(' ')
      .map(word => word.at(0)?.toUpperCase())
      .join('')
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }
}
