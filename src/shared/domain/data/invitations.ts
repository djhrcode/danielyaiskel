import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { Nullable } from '../core/nullable'
import { Invitation } from '../invitation'
import { AsyncEntityResponse } from './responses'

type InvitationJson = Omit<Invitation, 'code' | 'key'>

type InvitationVerifyJson = {
  token: string
  invitation: InvitationJson
}

export interface Invitations {
  getByKey(key: string): AsyncEntityResponse<InvitationJson>
  verifyCode(code: string): AsyncEntityResponse<Nullable<InvitationVerifyJson>>
}
