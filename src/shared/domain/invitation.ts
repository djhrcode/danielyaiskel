import { Guest } from './guest'
import { InvitationStatus } from './invitation_status'
import { Ticket } from './ticket'

export interface Invitation {
  id: number
  name: string
  code: string
  key: string
  rejections?: number[]
  ticket?: Ticket
  guests: Array<Guest>
  status: InvitationStatus
  created_at: string
}
