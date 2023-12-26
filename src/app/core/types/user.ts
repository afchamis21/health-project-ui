import {BaseResponse} from "./response";

export type User = {
  userId: number
  username: string
  email: string
  isActive: boolean
  isPaymentActive: boolean
  isRegistrationComplete: boolean
}

export type GetUserResponse = BaseResponse<User>
