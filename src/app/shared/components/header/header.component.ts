import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import {NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../utils/subscription-utils";
import {PaymentService} from "../../../core/services/payment.service";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false

  constructor(protected authService: AuthService, protected paymentService: PaymentService, private router: Router) {
  }

  header?: HTMLElement
  subscriptions: Subscription[] = []
  isLoggedIn = false

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  handleLogout() {
    const subscription = this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login'])
      },
      error: () => {
        this.router.navigate(['/login'])
      }
    })

    this.subscriptions.push(subscription)
  }

  ngOnInit(): void {
    this.header = this.getHeader()

    const authSubscription = this.authService.isLoggedIn$.subscribe(value => this.isLoggedIn = value)
    this.subscriptions.push(authSubscription)

    const routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const classList = this.header?.classList

        if (window.location.pathname === "/") {
          if (!classList?.contains('transparent-header')) {
            classList?.remove('colored-header')
            classList?.add('transparent-header')
          }
        } else {
          if (!classList?.contains('colored-header')) {
            classList?.add('colored-header')
            classList?.remove('transparent-header')
          }
        }


      }
    });

    this.subscriptions.push(routerSubscription)
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (window.location.pathname !== "/") {
      return
    }

    if (window.scrollY > 0) {
      this.header?.classList.add('colored-header')
      this.header?.classList.remove('transparent-header')
    } else {
      this.header?.classList.remove('colored-header')
      this.header?.classList.add('transparent-header')
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  private getHeader() {
    const header = document.getElementById('header')
    if (!header) {
      throw new Error("Id 'header' must be placed on header")
    }

    return header
  }
}
