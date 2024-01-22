import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  isRegistrationComplete = true

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    const userSubscription = this.authService.user$.subscribe(user => {
      if (user) {
        this.isRegistrationComplete = user.isRegistrationComplete
      }
    })


    this.subscriptions.push(userSubscription)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
  }
}
