import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaymentService} from "../../core/services/payment.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../../core/services/auth.service";
import {NgIf} from "@angular/common";
import {User} from "../../core/types/user";
import {MatDialog} from "@angular/material/dialog";
import {CheckoutDialogComponent, CheckoutDialogOutput} from "./components/checkout-dialog/checkout-dialog.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  isGoingToCheckout = false
  user: User | null = null

  constructor(
    private paymentService: PaymentService,
    protected authService: AuthService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    const subscription = authService.user$.subscribe(user => this.user = user)
    this.subscriptions.push(subscription)
  }

  startCheckout() {
    if (this.user && !this.user.isPaymentActive) {
      this.goToCheckout(this.user.email)
      return
    }

    this.openCheckoutDialog();
  }

  openCheckoutDialog() {
    const dialogRef = this.dialog.open(CheckoutDialogComponent, {
      data: {email: this.user?.email}
    })

    dialogRef.afterClosed().subscribe((value: CheckoutDialogOutput) => {
      if (!value.complete) {
        return
      }

      const {email} = value
      this.goToCheckout(email)
    })
  }

  private goToCheckout(email: string) {
    this.isGoingToCheckout = true
    this.paymentService.checkEmailBelongsToSubscriber(email).subscribe({
      next: value => {
        if (value.body.isUserSubscriber) {
          this.isGoingToCheckout = false;
          this.toastr.error("Esse email já pertence a um assinante!")
          return
        }

        this.paymentService.goToCheckout(email)
      }
    })
  }

  ngOnInit(): void {
    const subscription = this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('checkoutSuccessful')) {
        const checkoutSuccessful: boolean = JSON.parse(params['checkoutSuccessful'])
        if (checkoutSuccessful) {
          this.toastr.success("Confira seu email para completar o cadastro")
        } else {
          this.toastr.warning("Esperamos você em outro momento!")
        }
      }
    });
    this.subscriptions.push(subscription)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
  }
}
