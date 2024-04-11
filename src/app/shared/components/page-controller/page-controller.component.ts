import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {PaginationData} from "../../../core/types/http";

@Component({
  selector: 'app-page-controller',
  standalone: true,
  imports: [
    NgForOf,
    MatIconModule,
    NgClass
  ],
  templateUrl: './page-controller.component.html',
  styleUrl: './page-controller.component.css'
})
export class PageControllerComponent implements OnInit, OnChanges {
  @Output() onSpecificPage = new EventEmitter<number>()
  @Output() onPreviousPage = new EventEmitter<void>()
  @Output() onNextPage = new EventEmitter<void>()

  @Input() paginationData!: PaginationData

  pages: number[] = []

  ngOnInit(): void {
    this.pages = this.calculateDisplayedPages()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paginationData'] && !changes['paginationData'].firstChange) {
      console.log("Changes to pagination data happened", changes['paginationData'].currentValue)
      this.paginationData = changes['paginationData'].currentValue
    }

    this.pages = this.calculateDisplayedPages()
  }

  calculateDisplayedPages({page: currentPage, lastPage, maxPages}: PaginationData = this.paginationData): number[] {
    const displayedPages: number[] = [];

    for (let i = 0; i <= lastPage; i++) {
      displayedPages.push(i)
    }

    if (maxPages >= displayedPages.length) {
      return displayedPages;
    }

    if (currentPage + maxPages > displayedPages.length) {
      return displayedPages.slice(displayedPages.length - maxPages)
    }

    return displayedPages.slice(currentPage, currentPage + maxPages);
  }

  goToNextPage() {
    if (this.paginationData.page !== this.paginationData.lastPage) {
      this.onNextPage.emit()
    }
  }

  goToPreviousPage() {
    if (this.paginationData.page !== 0) {
      this.onPreviousPage.emit()
    }
  }

  goToSpecificPage(page: number) {
    if (page !== this.paginationData.page) {
      this.onSpecificPage.emit(page)
    }
  }
}
