import { client } from '@/shared/data/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req
  const { query: search, page = '1', perPage = '10' } = query

  const queryPage = parseInt(page as string)
  const itemsPerPage = parseInt(perPage as string)
  const queryTo = queryPage * itemsPerPage - 1
  const queryFrom = (queryPage - 1) * itemsPerPage

  let queryBuilder = client
    .from('invitations')
    .select(
      `id, name, key, status, guests!inner (id, first_name, last_name, genre, status)`
    )

  if (search)
    queryBuilder = queryBuilder.or(
      `last_name.ilike.%${search}%, first_name.ilike.%${search}%`,
      { foreignTable: 'guests' }
    )

  const { data, error, ...queryResult } = await queryBuilder.range(
    queryFrom,
    queryTo
  )

  if (error) res.status(400).json(error)

  res.status(200).json({
    ...queryResult,
    data,
    page: queryPage,
    perPage: itemsPerPage,
    queryFrom,
    queryTo,
  })
}
