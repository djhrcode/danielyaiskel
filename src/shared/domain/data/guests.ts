import { Nullable } from '../core/nullable'
import { Guest } from '../guest'
import { Invitation } from '../invitation'

type GuestsQuery = Partial<Invitation>

export interface Guests {
  search(query: GuestsQuery): Promise<Array<Guest>>
}
