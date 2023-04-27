import { GuestGenre } from '@/shared/domain/guest_genre'
import invitations from './invitations.json'
import { Invitation } from '@/shared/domain/invitation'
import { RefObject } from 'react'
import ShortUniqueId from 'short-unique-id'
import { InvitationStatus } from '@/shared/domain/invitation_status'
import { Mandatory } from '@/shared/domain/core/mandatory'
import { Guest } from '@/shared/domain/guest'
import { mkdir, mkdirSync, writeFileSync } from 'fs'
import path from 'path'

type GuestData = {
  first_name?: string
  last_name?: string
  genre?: GuestGenre
  invitation?: false
  status?: InvitationStatus
}

type InvitationData = Array<
  | GuestData
  | {
      name?: string
      invitation?: true
    }
>

const shortUid = new ShortUniqueId({ length: 10 })

function createOtp(length: number = 6): string {
  const otpLength = length
  const otpChars = '0123456789'
  const otpParts = []

  for (let i = 0; i < otpLength; i++) {
    otpParts.push(otpChars.charAt(Math.floor(Math.random() * otpChars.length)))
  }

  return otpParts.join('')
}

type InvitationRecord = Mandatory<
  Invitation,
  'key' | 'code' | 'name' | 'guests' | 'status'
>

let total: number = 0
let men: number = 0
let women: number = 0

const createInvitation = ({ name }: { name: string }) =>
  ({
    key: shortUid(),
    code: createOtp(),
    name,
    guests: [],
    status: InvitationStatus.Pending,
  } as InvitationRecord)

const tranformToDomain = (data: InvitationData) => {
  const registry = new Map<symbol, InvitationRecord>([])
  const group: { current: null | symbol } = { current: null }

  data.forEach((item) => {
    if (item.invitation === true) {
      group.current = null

      const { name } = item
      const key = Symbol(name)
      const invitation = createInvitation({ name: name as string })

      group.current = key
      registry.set(key, invitation)

      return
    }

    if (group.current === null)
      throw new TypeError('Not invitation but no symbol available')

    const invitation = registry.get(group.current)

    if (invitation === undefined)
      throw new TypeError('No invitation found in registry by symbol')

    const { guests } = invitation

    const guest: GuestData = {
      ...(item as GuestData),
      status: InvitationStatus.Pending,
    }

    registry.set(group.current, {
      ...invitation,
      guests: [...guests, guest as Guest],
    })

    total++
    guest.genre === GuestGenre.Male ? men++ : women++
  })

  return registry
}

const timestamp = Date.now().toString()
const generated = Array.from(tranformToDomain(invitations).values())

const createMessage = (
  { name, guests, key, code }: InvitationRecord,
  index: number
) => `

### Invitación "${name}" (${guests.length} ${
  guests.length > 1 ? 'personas' : 'persona'
})

${guests
  .map(
    (guest, index) =>
      `${index + 1}) ${guest.first_name} ${guest.last_name} (${
        guest.genre === 1 ? 'H' : 'M'
      })`
  )
  .join('\n')}

**Código de verificación:** ${code}
**Link de confirmación:** [https://danielyaiskel.vercel.app/?key=${key}](https://danielyaiskel.vercel.app/?key=${key})

`

mkdirSync(path.resolve(__dirname, `./.output/invitations_${timestamp}`), {
  recursive: true,
})

writeFileSync(
  path.resolve(__dirname, `./.output/invitations_${timestamp}/data.json`),
  JSON.stringify(generated)
)
writeFileSync(
  path.resolve(__dirname, `./.output/invitations_${timestamp}/invitations.txt`),
  [
    '## Listado de invitaciones ',
    ...generated.map((item, index) => createMessage(item, index)),
    `
Total invitados: ${total}
Total hombres: ${men}
Total mujeres: ${women}
`,
  ].join('<br/><hr/>')
)
