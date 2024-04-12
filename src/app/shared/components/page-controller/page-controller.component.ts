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

  @Input() currentPage!: number
  @Input() lastPage!: number
  @Input() controllerSize!: number

  pages: number[] = []

  ngOnInit(): void {
    this.pages = this.calculateDisplayedPages()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['page'] && !changes['page'].firstChange) {
      this.currentPage = changes['page'].currentValue
    }

    if (changes['lastPage'] && !changes['lastPage'].firstChange) {
      this.lastPage = changes['lastPage'].currentValue
    }

    if (changes['controllerSize'] && !changes['controllerSize'].firstChange) {
      this.controllerSize = changes['controllerSize'].currentValue
    }

    this.pages = this.calculateDisplayedPages()
  }

  calculateDisplayedPages(): number[] {
    const displayedPages: number[] = [];

    for (let i = 0; i <= this.lastPage; i++) {
      displayedPages.push(i)
    }

    if (this.controllerSize >= displayedPages.length) {
      return displayedPages;
    }

    if (this.currentPage + this.controllerSize > displayedPages.length) {
      return displayedPages.slice(displayedPages.length - this.controllerSize)
    }

    return displayedPages.slice(this.currentPage, this.currentPage + this.controllerSize);
  }

  goToNextPage() {
    if (this.currentPage !== this.lastPage) {
      this.onNextPage.emit()
    }
  }

  goToPreviousPage() {
    if (this.currentPage !== 0) {
      this.onPreviousPage.emit()
    }
  }

  goToSpecificPage(page: number) {
    if (page !== this.currentPage) {
      this.onSpecificPage.emit(page)
    }
  }
}
