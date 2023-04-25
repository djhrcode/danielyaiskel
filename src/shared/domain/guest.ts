import { GuestGenre } from './guest_genre'
import { Invitation } from './invitation'
import { InvitationStatus } from './invitation_status'

export interface Guest {
  id: number
  first_name: string
  last_name: string
  invitation?: Invitation
  ticket?: Invitation
  genre: GuestGenre
  status: InvitationStatus
  created_at: string
  deleted_at?: string
}
