import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Tab} from "../../../../core/types/tab";
import {User} from "../../../../core/types/user";
import {Workspace} from "../../../../core/types/workspace";
import {NgIf} from "@angular/common";
import {WorkspaceService} from "../../../../core/services/workspace.service";
import {WorkspaceStateService} from "../../../../core/services/workspace-state.service";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../../../shared/utils/subscription-utils";

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent implements OnInit, OnDestroy, OnChanges {
  @Input() user!: User;
  @Input() workspace: Workspace | null = null;

  selectedTab: Tab | null = null;
  clockedIn = false

  subscriptions: Subscription[] = []

  constructor(private workspaceService: WorkspaceService, private workspaceStateService: WorkspaceStateService) {
  }

  ngOnInit(): void {
    const workspaceSubscription = this.workspaceStateService.workspace$.subscribe(value => {
      this.workspace = value
    })

    this.subscriptions.push(workspaceSubscription)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  ngOnChanges(changes: SimpleChanges): void {
    // TODO when workspace changes, and also if necessary clock out previous workspace,
    //  if user is not owner, show clock in (need to develop this on backend) else just show workspace and tabs.

    // TODO when workspace changes, reset everything, (selected tabs etc.). On the future there might be things we
    //  need to do when closing the workspace.
  }
}
