import { createClient } from '@supabase/supabase-js'
import { config } from './config'
import { Invitation } from '../domain/invitation'
import { Optional } from '../domain/core/optional'
import { Guest } from '../domain/guest'
import { Mandatory } from '../domain/core/mandatory'
import { Ticket } from '../domain/ticket'

type InvitationRecord = Omit<Invitation, 'guests' | 'ticket'>

type TicketRecord = Omit<
  Ticket & {
    invitation_id?: number
  },
  'invitation' | 'guests'
>

type GuestRecord = Omit<
  Guest & {
    ticket_id?: number
    invitation_id?: number
  },
  'invitation' | 'ticket'
>

interface Database {
  public: {
    Views: {}
    Functions: {}
    Tables: {
      invitations: {
        Row: InvitationRecord
        Insert: Mandatory<InvitationRecord, 'name' | 'code' | 'key'>
        Update: Partial<InvitationRecord>
      }

      guests: {
        Row: GuestRecord
        Insert: Mandatory<GuestRecord, 'first_name' | 'last_name' | 'genre'>
        Update: Partial<GuestRecord>
      }

      tickets: {
        Row: TicketRecord
        Insert: Mandatory<TicketRecord, 'invitation_id'>
        Update: Partial<TicketRecord>
      }
    }
  }
}

export const client = createClient<Database>(config.url, config.token)
