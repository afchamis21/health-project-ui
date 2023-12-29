import {Subscription} from "rxjs";

export class SubscriptionUtils {
  private constructor() {
  }

  public static unsubscribe(subscriptions: Subscription[]) {
    subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
  }
}
