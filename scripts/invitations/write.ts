import dotenv from 'dotenv'
import { program } from 'commander'
import invitations from './.output/invitations_1682519241002/data.json'

program
  .version('1.0.0')
  .option(
    '-e --env <value>',
    'Customize the .env file location/name',
    undefined
  )
  .parse()

const options = program.opts()

dotenv.config({ path: options.env })

async function write() {
  const { client } = await import('@/shared/data/client')

  for (const json of invitations) {
    const { guests, ...invitation } = json

    const { data: invitationResult, error: invitationError } = await client
      .from('invitations')
      .insert(invitation)
      .select()

    if (invitationError)
      throw new Error(JSON.stringify({ ...invitationError, invitation }))

    console.log('invitation written', invitation.name)

    const [writtenInvitation] = invitationResult

    const { data: guestResult, error: guestError } = await client
      .from('guests')
      .insert(
        guests.map((record) => ({
          ...record,
          invitation_id: writtenInvitation.id,
        }))
      )
      .select()

    if (guestError)
      throw new Error(JSON.stringify({ ...guestError, invitation }))

    console.log('guests written', invitation.name, guests.length)
  }
}

write()
