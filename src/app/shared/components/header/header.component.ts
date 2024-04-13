import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../core/services/auth/auth.service";
import {NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../utils/subscription-utils";
import {PaymentService} from "../../../core/services/payment/payment.service";
import {MatIconModule} from "@angular/material/icon";
import {ClockOutButtonComponent} from "../clock-out-button/clock-out-button.component";
import {UserStateService} from "../../../core/services/user/user-state.service";
import {User} from '../../../core/types/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    MatIconModule,
    ClockOutButtonComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false

  constructor(protected authService: AuthService, protected paymentService: PaymentService,
              private router: Router, private userStateService: UserStateService) {
  }

  header?: HTMLElement
  subscriptions: Subscription[] = []
  user: User | null = null

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  async handleLogout() {
    if (this.userStateService.currentUserValue?.isClockedIn) {
      await this.userStateService.handleClockOut()
    }

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

    const userSubscription = this.userStateService.user$.subscribe((data) => {
      this.user = data
    })

    this.subscriptions.push(routerSubscription, userSubscription)
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
