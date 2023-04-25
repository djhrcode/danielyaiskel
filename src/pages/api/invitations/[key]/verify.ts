import { Invitations } from '@/shared/data/invitations'
import { invitations } from '@/shared/data/tables'
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method, body } = req
  const { key } = query
  const { code } = body

  if (method !== 'POST')
    return res.status(404).json({ error: 'Method not allowed' })

  const results = await invitations
    .select(
      `id, name, status, tickets (id, status), guests (id, first_name, last_name, genre, status)`
    )
    .eq('key', key)
    .eq('code', code)
    .single()

  const { error, status } = results

  if (error) return res.status(status).json({ ...results, key, code })

  const token = jwt.sign({ key }, process.env.SUPABASE_JWT_SECRET as string)

  res.status(200).json({
    ...results,

    data: {
      token,
      invitation: results.data,
    },
  })
}
