import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Tab, tabs} from "../../../../../core/types/tab";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {User} from "../../../../../core/types/user";
import {UserStateService} from "../../../../../core/services/user/user-state.service";
import {PatientStateService} from "../../../../../core/services/patient/patient-state.service";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../../../../shared/utils/subscription-utils";
import {ClockOutButtonComponent} from "../../../../../shared/components/clock-out-button/clock-out-button.component";
import {PatientSummary} from "../../../../../core/types/patient";

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

  patientSummary: PatientSummary | null = null
  tabs = tabs
  filteredTabs: Tab[] = []
  user: User | null = null

  subscriptions: Subscription[] = []

  constructor(protected userStateService: UserStateService, private patientStateService: PatientStateService) {
  }

  ngOnInit(): void {
    const user$ = this.userStateService.user$.subscribe({
      next: user => {
        this.user = user
      }
    })

    const patientSummary$ = this.patientStateService.patientSummary$.subscribe({
      next: value => {
        this.patientSummary = value
        this.filterTabs()
      }
    })

    this.subscriptions.push(user$, patientSummary$)

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
      return !tab.ownerOnly || (tab.ownerOnly && this.user?.userId === this.patientSummary?.ownerId)
    })
  }

  selectTab(tab: Tab) {
    this.onTabSelected.emit(tab)
  }

  formatDisplayText(displayText: string): string {
    return (displayText.at(0)?.toUpperCase() || '') + (displayText.slice(1)?.toLowerCase() || '')
  }
}
