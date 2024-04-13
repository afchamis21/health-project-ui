import {Component, OnInit} from '@angular/core';
import {User} from "../../../core/types/user";
import {UserStateService} from "../../../core/services/user/user-state.service";
import {WorkspaceStateService} from "../../../core/services/workspace/workspace-state.service";
import {Subscription} from "rxjs";
import {Workspace} from "../../../core/types/workspace";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-clock-out-button',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './clock-out-button.component.html',
  styleUrl: './clock-out-button.component.css'
})
export class ClockOutButtonComponent implements OnInit {
  user: User | null = null
  workspace: Workspace | null = null
  subscriptions: Subscription[] = []

  constructor(protected userStateService: UserStateService, private workspaceStateService: WorkspaceStateService) {
  }

  ngOnInit(): void {
    const userSub = this.userStateService.user$.subscribe({
      next: user => {
        this.user = user
      }
    })

    const workspaceSub = this.workspaceStateService.workspace$.subscribe({
      next: workspace => {
        this.workspace = workspace
      }
    })

    this.subscriptions.push(userSub, workspaceSub)
  }
}
