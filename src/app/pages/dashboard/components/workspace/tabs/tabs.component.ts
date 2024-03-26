import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Tab, tabs} from "../../../../../core/types/tab";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent implements OnInit, OnChanges {
  @Input() activeTab: Tab | null = null
  @Input() isOwner: boolean = false

  @Output() onTabSelected = new EventEmitter<Tab>()

  tabs = tabs
  filteredTabs: Tab[] = []

  ngOnInit(): void {
    this.filterTabs()
  }

  filterTabs() {
    this.filteredTabs = Object.values(this.tabs).filter(tab => {
      return !tab.ownerOnly || (tab.ownerOnly && this.isOwner)
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeTab'] && !changes['activeTab']?.firstChange) {
      this.activeTab = changes['activeTab'].currentValue
    }

    if (changes['isOwner'] && !changes['isOwner']?.firstChange) {
      this.isOwner = changes['isOwner'].currentValue
      this.filterTabs()
    }
  }

  selectTab(tab: Tab) {
    this.onTabSelected.emit(tab)
  }

  formatDisplayText(displayText: string): string {
    return (displayText.at(0)?.toUpperCase() || '') + (displayText.slice(1)?.toLowerCase() || '')
  }
}
