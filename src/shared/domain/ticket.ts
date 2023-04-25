import { Guest } from './guest'
import { Invitation } from './invitation'
import { TicketStatus } from './ticket_status'

export interface Ticket {
  id: number
  status: TicketStatus
  guests: Array<Guest>
  invitation: Invitation
  created_at: string
}
