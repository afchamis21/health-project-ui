import {BaseResponse} from "./response";

export type GetCheckoutSessionResponse = BaseResponse<{ sessionId: string }>

export type GetBillingPortalSessionResponse = BaseResponse<{ url: string }>

export type GetEmailBelongsToSubscriberResponse = BaseResponse<{ isUserSubscriber: boolean }>
