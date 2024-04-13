import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Tab, tabs} from "../../../../../core/types/tab";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {User} from "../../../../../core/types/user";
import {Workspace} from "../../../../../core/types/workspace";
import {UserStateService} from "../../../../../core/services/user/user-state.service";
import {WorkspaceStateService} from "../../../../../core/services/workspace/workspace-state.service";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../../../../shared/utils/subscription-utils";
import {ClockOutButtonComponent} from "../../../../../shared/components/clock-out-button/clock-out-button.component";

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    ClockOutButtonComponent
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() activeTab: Tab | null = null

  @Output() onTabSelected = new EventEmitter<Tab | null>()

  workspace: Workspace | null = null
  tabs = tabs
  filteredTabs: Tab[] = []
  user: User | null = null

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
        this.filterTabs()
      }
    })

    this.subscriptions.push(userSub, workspaceSub)

    this.filterTabs()
  }


  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeTab'] && !changes['activeTab']?.firstChange) {
      this.activeTab = changes['activeTab'].currentValue
    }
  }

  filterTabs() {
    this.filteredTabs = Object.values(this.tabs).filter(tab => {
      return !tab.ownerOnly || (tab.ownerOnly && this.user?.userId === this.workspace?.ownerId)
    })
  }

  selectTab(tab: Tab) {
    this.onTabSelected.emit(tab)
  }

  formatDisplayText(displayText: string): string {
    return (displayText.at(0)?.toUpperCase() || '') + (displayText.slice(1)?.toLowerCase() || '')
  }
}
