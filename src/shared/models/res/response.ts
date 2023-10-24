import { ErrorResponse } from './error.response'

export class Response extends ErrorResponse {
  Succeeded: boolean
  Error?: ErrorResponse[]
}
