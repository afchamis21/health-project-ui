import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

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

  @Input() currentPage = 0
  @Input() lastPage = 0
  @Input() maxPages = 0

  pages: number[] = []

  ngOnInit(): void {
    this.pages = this.calculateDisplayedPages()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lastPage'] && !changes['lastPage'].firstChange) {
      this.lastPage = changes['lastPage'].currentValue
    }

    if (changes['currentPage'] && !changes['currentPage'].firstChange) {
      this.currentPage = changes['currentPage'].currentValue
    }

    if (changes['maxPages'] && !changes['maxPages'].firstChange) {
      this.maxPages = changes['maxPages'].currentValue
    }

    this.pages = this.calculateDisplayedPages()
  }

  calculateDisplayedPages(
    currentPage: number = this.currentPage,
    lastPage: number = this.lastPage,
    maxPages: number = this.maxPages
  ): number[] {
    const displayedPages: number[] = [];

    let startPage: number;
    let endPage: number;

    if (lastPage <= maxPages) {
      startPage = 1;
      endPage = lastPage;
    } else if (currentPage <= Math.ceil(maxPages / 2)) {
      startPage = 1;
      endPage = maxPages;
    } else if (currentPage >= lastPage - Math.floor(maxPages / 2)) {
      startPage = lastPage - maxPages + 1;
      endPage = lastPage;
    } else {
      startPage = currentPage - Math.floor(maxPages / 2);
      endPage = currentPage + Math.floor(maxPages / 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      displayedPages.push(i);
    }

    return displayedPages;
  }

  goToNextPage() {
    if (this.currentPage !== this.lastPage) {
      this.onNextPage.emit()
    }
  }

  goToPreviousPage() {
    if (this.currentPage !== 1) {
      this.onPreviousPage.emit()
    }
  }

  goToSpecificPage(page: number) {
    if (page !== this.currentPage) {
      this.onSpecificPage.emit(page)
    }
  }
}
