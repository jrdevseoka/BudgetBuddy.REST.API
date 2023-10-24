import { Response } from './response'

export class AuthResponse<T> extends Response {
  AccessToken?: string | undefined
  RefreshToken?: string | undefined
  Data?: T
}
