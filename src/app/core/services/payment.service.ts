import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {loadStripe, Stripe} from "@stripe/stripe-js";
import {
  GetBillingPortalSessionResponse,
  GetCheckoutSessionResponse,
  GetEmailBelongsToSubscriberResponse
} from "../types/payments";


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripe: Stripe | null = null
  private baseUrl = environment.apiURL + "/payments"

  constructor(private http: HttpClient) {
    loadStripe(environment.stripePublicKey).then((value) => {
      this.stripe = value
    });
  }

  goToCheckout(email: string) {
    this.requestMemberSession(environment.stripeSubscriptionId, email).subscribe({
      next: (value) => {
        this.redirectToCheckout(value.body.sessionId)
      }
    })
  }

  private requestMemberSession(priceId: string, email: string) {
    return this.http.post<GetCheckoutSessionResponse>(`${this.baseUrl}/create-checkout-session`, {
      priceId,
      email: email,
      successUrl: window.location.origin + "?checkoutSuccessful=true",
      cancelUrl: window.location.origin + "?checkoutSuccessful=false"
    })
  }

  private redirectToCheckout(sessionId: string) {
    this.stripe?.redirectToCheckout({
      sessionId
    })
  }

  goToBillingPortal() {
    this.requestBillingPortalSession().subscribe({
      next: (value) => {
        window.location.href = value.body.url
      }
    })
  }

  private requestBillingPortalSession() {
    return this.http.post<GetBillingPortalSessionResponse>(`${this.baseUrl}/create-billing-portal-session`, {
      returnUrl: window.location.origin
    })
  }

  checkEmailBelongsToSubscriber(email: string) {
    return this.http.get<GetEmailBelongsToSubscriberResponse>(`${this.baseUrl}/is-user-subscriber`, {
      params: {
        email
      }
    })
  }
}
