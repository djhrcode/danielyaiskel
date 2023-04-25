import { Nullable } from '../core/nullable'
import { Ticket } from '../ticket'

export interface Tickets {
  getByCode(): Nullable<Ticket>
  getByKey(): Nullable<Ticket>
}
