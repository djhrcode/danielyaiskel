import { Invitations } from '@/shared/data/invitations'
import { invitations } from '@/shared/data/tables'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req
  const { key } = query

  const results = await invitations
    .select(
      `id, name, status, tickets (id, status), guests (id, first_name, last_name, genre, status)`
    )
    .eq('key', key)
    .limit(1)

  res.status(200).json({ ...results, data: results?.data?.[0] })
}
