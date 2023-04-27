import { Invitations } from '@/shared/data/invitations'
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { InvitationStatus } from '@/shared/domain/invitation_status'
import { TicketStatus } from '@/shared/domain/ticket_status'
import { Guest } from '@/shared/domain/guest'
import { client } from '@/shared/data/client'
import { Mandatory } from '@/shared/domain/core/mandatory'

export async function authenticate(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    return jwt.verify(token, process.env.SUPABASE_JWT_SECRET ?? '')
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = authenticate(req, res)

  const { query, method, body } = req
  const { key } = query
  const { status: givenStatus, statusForAll, rejections = [] } = body

  if (method !== 'POST')
    return res.status(404).json({ error: 'Method not allowed' })

  const {
    data: invitation,
    error,
    ...rest
  } = await client
    .from('invitations')
    .select(`id, name, guests (*)`)
    .eq('key', key)
    .single()

  if (error)
    return res.status(rest.status).json({
      ...rest,
      data: null,
      error,
    })

  if (statusForAll && givenStatus === InvitationStatus.Accepted) {
    const { data: ticket, error: ticketError } = await client
      .from('tickets')
      .insert({
        status: TicketStatus.Created,
        invitation_id: invitation.id,
      })
      .select()
      .single()

    if (ticketError)
      return res.status(500).json({
        data: {
          message:
            'No se ha podido confirmar la invitación, intenta más tarde :(',
        },
      })

    await client
      .from('invitations')
      .update({ status: givenStatus })
      .eq('id', invitation.id)

    const guestsResults = await client
      .from('guests')
      .update({ status: givenStatus, ticket_id: ticket.id })
      .eq('invitation_id', invitation.id)
      .select()

    return res.status(200).json({
      data: {
        guests: guestsResults.data,
        message: 'Gracias por aceptar nuestra invitación :)',
      },
    })
  }

  if (statusForAll) {
    await client
      .from('invitations')
      .update({ status: givenStatus })
      .eq('id', invitation.id)

    const guestsResults = await client
      .from('guests')
      .update({ status: givenStatus })
      .eq('invitation_id', invitation.id)
      .select()

    return res.status(200).json({
      data: {
        guests: guestsResults.data,
        message: 'Lamentamos que no nos puedan acompañar. Nos harán falta :(',
      },
    })
  }

  if (rejections.length === 0)
    return res.status(400).json({
      data: {
        message:
          'No se ha podido confirmar la invitación, intenta más tarde :(',
        detail:
          'Field [rejections] must contain at least one item when [statusForAll] is false',
      },
    })

  if (givenStatus === InvitationStatus.Accepted) {
    const ticketByInvitation = await client
      .from('tickets')
      .select('id')
      .eq('invitation_id', invitation.id)
      .limit(1)
      .order('id')

    const ticketExists = !!ticketByInvitation?.data?.[0]

    console.log(ticketByInvitation.data, ticketByInvitation.error, ticketExists)

    const ticketsRecords = !ticketExists
      ? await client
          .from('tickets')
          .insert({
            status: TicketStatus.Created,
            invitation_id: invitation.id,
          })
          .select()
      : await client
          .from('tickets')
          .update({
            status: TicketStatus.Created,
            invitation_id: invitation.id,
          })
          .eq('id', ticketByInvitation.data?.[0]?.id)
          .select()

    console.log(ticketsRecords, ticketByInvitation.data?.[0]?.id)

    const [ticket] = ticketsRecords.data ?? []

    if (ticketsRecords.error)
      return res.status(500).json({
        data: {
          details: ticketsRecords.error.details,
          message:
            'No se ha podido confirmar la invitación, intenta más tarde :(',
        },
      })

    const guestsRejections = new Set(rejections)
    const invitationGuests = invitation.guests as Guest[]

    await client
      .from('invitations')
      .update({ status: givenStatus, rejections })
      .eq('id', invitation.id)

    const guestsData = invitationGuests.map((guest) =>
      guestsRejections.has(guest.id)
        ? {
            ...guest,
            status: InvitationStatus.Rejected,
            ticket_id: null as unknown as number,
          }
        : {
            ...guest,
            status: givenStatus as number,
            ticket_id: ticket.id as number,
          }
    ) as unknown as Mandatory<Guest, 'genre' | 'first_name' | 'last_name'>[]

    const guestsResults = await client
      .from('guests')
      .upsert(guestsData)
      .select()

    if (guestsResults.error)
      return res.status(500).json({
        error: {
          details: guestsResults.error.details,
          message:
            'No se ha podido confirmar la invitación, intenta más tarde :(',
        },
      })

    return res.status(200).json({
      data: {
        guests: guestsResults.data,
        message: 'Gracias por aceptar nuestra invitación :)',
      },
    })
  }
}
