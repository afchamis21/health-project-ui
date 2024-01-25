import {BaseResponse} from "./response";

export type User = {
  userId: number
  username: string
  email: string
  isPaymentActive: boolean
  isRegistrationComplete: boolean
}

export type GetUserResponse = BaseResponse<User>

export type CompleteRegistrationRequest = {
  username: string,
  password: string,
  confirmPassword: string
}
