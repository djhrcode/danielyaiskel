import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Checkbox,
  Divider,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Icon,
  IconButton,
  Link,
  List,
  ListItem,
  PinInput,
  PinInputField,
  Spacer,
  Stack,
  Text,
  useBreakpoint,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { ArrowForwardIcon, HamburgerIcon } from '@chakra-ui/icons'
import styled from '@emotion/styled'
import { Drawer } from '@chakra-ui/react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseIcon,
  HeartIcon,
  ListLayoutIcon,
  TickIcon,
} from '@/shared/ui/icons'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { Invitation } from '@/shared/domain/invitation'
import { InvitationStatus } from '@/shared/domain/invitation_status'
import { Guest } from '@/shared/domain/guest'

const Heart = styled(HeartIcon)({
  fontSize: '0.5em',
})

const TextDivider = styled(Divider)({
  borderColor: '#443307',
  borderWidth: '1px',
  borderStyle: 'dashed',
})

type OptionProps = React.PropsWithChildren<{
  checked?: boolean
  selectable?: boolean
  onChange?: (checked: boolean) => void
}>

const OptionListItem = styled(ListItem)<OptionProps>(
  ({ checked, selectable }) => ({
    borderColor: checked ? '#8b6504' : '#dfd3bf',
    color: '#443307',
    backgroundColor: '#ffffff76',
    fontFamily: 'DM Sans',
    fontSize: '1.25em',
    fontWeight: checked ? 500 : 400,
    padding: '0.5em 1em',
    borderWidth: checked ? '1px' : '1px',
    boxShadow: checked ? '0 0 0 1px #8b6504' : '0 0 0 0px transparent',
    borderRadius: '0.5em',
    minWidth: '360px',
    marginBottom: '0.5em',
    display: 'flex',
    alignItems: 'center',
    transition: 'box-shadow, border-color 0.2s ease-in-out',
    cursor: selectable ? 'pointer' : undefined,
  })
)

function ListOption({ selectable, checked, children, onChange }: OptionProps) {
  const [isChecked, setIsChecked] = useState(checked)

  const handleChange = (newValue: boolean) => {
    if (!selectable) return

    setIsChecked(newValue)
    onChange?.(newValue)
  }

  useEffect(() => setIsChecked(checked), [checked])

  return (
    <OptionListItem
      onClick={(e) => {
        e.preventDefault()
        handleChange(!isChecked)
      }}
      checked={selectable ? isChecked : undefined}
    >
      {selectable && (
        <Checkbox
          isChecked={isChecked}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleChange(e.target.checked)}
          mr="3"
          borderColor="#9e8866"
        ></Checkbox>
      )}
      {children}
    </OptionListItem>
  )
}

export default function Home() {
  const { query: { select = false } = {}, push: navigateTo } = useRouter()
  const { isOpen, onClose, onOpen } = useDisclosure()

  const {
    setValue: setInvitationStorage,
    value: invitation,
    hasValue: hasInvitationStorage,
  } = useLocalStorage<Invitation>('invitation-data')

  const {
    setValue: setKeyStorage,
    value: keyValue,
    hasValue: hasKeyStorage,
  } = useLocalStorage<string>('invitation-key')

  const {
    setValue: setTokenStorage,
    value: tokenValue,
    hasValue: hasTokenStorage,
  } = useLocalStorage<string>('invitation-token')

  const selectable = useMemo(() => select === 'true', [select])

  const [selected, rejected] = useMemo<[number[], number[]]>(() => {
    const { guests = [] } = invitation ?? {}

    const toId = ({ id: guestId }: Guest) => guestId

    console.log(guests)

    if (!selectable) return [guests?.map(toId), []]

    return [
      [
        ...guests
          .filter(({ status }) => status === InvitationStatus.Accepted)
          .map(toId),
      ],
      [
        ...guests
          .filter(({ status }) => status !== InvitationStatus.Accepted)
          .map(toId),
      ],
    ]
  }, [invitation])

  const dialogRef = useRef<HTMLButtonElement | null>(null)

  const launchToast = useToast()

  const submitConfirmation = async ({
    status,
    statusForAll,
    rejections,
  }: {
    statusForAll: boolean
    status: InvitationStatus
    rejections: number[]
  }) => {
    const response = await fetch(`/api/invitations/${keyValue}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ statusForAll, status, rejections }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${tokenValue}`,
      },
    })

    if (!response.ok)
      return launchToast({
        title: 'Ha ocurrido un error',
        description:
          'No pudimos procesar tu confirmación, por favor intente más tarde',
        status: 'error',
        duration: 8000,
        isClosable: true,
      })

    const json = await response.json()

    console.log('response', json)

    if (invitation)
      setInvitationStorage({ ...invitation, guests: json.data?.guests })

    if (status === InvitationStatus.Accepted) {
      launchToast({
        title: 'Confirmación exitosa',
        description: 'Muchas gracias por confirmar tu asistencia',
        status: 'success',
        duration: 8000,
        isClosable: true,
      })

      return navigateTo({ pathname: '/status/accepted' })
    }

    if (
      status === InvitationStatus.Canceled ||
      status === InvitationStatus.Rejected
    )
      launchToast({
        title: 'Hemos rechazado/cancelado tu invitación',
        description: 'Lamentamos que no nos puedas acompañar :(',
        status: 'success',
        duration: 8000,
        isClosable: true,
      })

    return navigateTo({ pathname: '/status/rejected' })
  }

  const hasSingleGuest = () => invitation?.guests?.length === 1

  return (
    <>
      <Stack direction="column" align="center" spacing="4" py="6">
        <Heading variant="regular" size="xl" textAlign="center">
          {hasSingleGuest() ? '¿Nos acompañas?' : '¿Nos acompañan?'}
        </Heading>

        {invitation &&
          (hasSingleGuest() ? (
            <Text as="div" fontSize="1.25em" my="6" textAlign="center" px="4">
              Por favor, indícanos si puedes asistir y acompañarnos en este día
              tan especial
            </Text>
          ) : (
            <Text as="div" fontSize="1.25em" my="6" textAlign="center" px="4">
              Tienes {invitation?.guests?.length ?? 0} invitados. Por favor,
              indícanos si todos los invitados que hemos incluido asistirán a la
              boda
            </Text>
          ))}

        {invitation && (
          <List>
            {invitation?.guests.map(
              ({ id: guestId, first_name, last_name, status }, index) => (
                <ListOption
                  key={guestId}
                  checked={status === InvitationStatus.Accepted}
                  onChange={(isAttending) => {
                    setInvitationStorage({
                      ...invitation,
                      guests: invitation.guests.map((guest) => {
                        if (guestId !== guest.id) return guest

                        return {
                          ...guest,
                          status: isAttending
                            ? InvitationStatus.Accepted
                            : InvitationStatus.Rejected,
                        }
                      }),
                    })
                  }}
                  selectable={selectable}
                >
                  {first_name} {last_name}
                </ListOption>
              )
            )}
          </List>
        )}

        <Button
          rightIcon={<TickIcon fontSize="24px" />}
          size="lg"
          variant="outline"
          _disabled={{ opacity: 0.5 }}
          isDisabled={selectable ? selected.length < 1 : false}
          onClick={() =>
            submitConfirmation(
              selectable
                ? {
                    statusForAll: false,
                    rejections: rejected,
                    status: InvitationStatus.Accepted,
                  }
                : {
                    statusForAll: true,
                    rejections: [],
                    status: InvitationStatus.Accepted,
                  }
            )
          }
        >
          {selectable
            ? 'Confirmar seleccionados'
            : hasSingleGuest()
            ? 'Si, confirmar asistencia'
            : 'Si, confirmar a todos'}
        </Button>

        {!selectable && !hasSingleGuest() && (
          <Button
            as={Link}
            href={`/confirm?select=true`}
            rightIcon={<ListLayoutIcon fontSize="24px" />}
            size="lg"
          >
            Confirmar algunos
          </Button>
        )}

        {!selectable && (
          <Button
            as={Link}
            color="#a91c00"
            rightIcon={<CloseIcon fontSize="20px" />}
            size="lg"
            variant="link"
            onClick={onOpen}
          >
            {hasSingleGuest() ? 'No podré asistir' : 'No podemos asistir'}
          </Button>
        )}

        {selectable && (
          <Button
            as={Link}
            color="#a91c00"
            href="/confirm"
            leftIcon={<ArrowLeftIcon fontSize="28px" />}
            size="lg"
            variant="link"
          >
            Regresar
          </Button>
        )}
      </Stack>

      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        leastDestructiveRef={dialogRef}
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>¿Seguro deseas continuar?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody fontSize="16px">
            {hasSingleGuest()
              ? 'Si continúas se rechazará tu invitación y no podrás revertir esta acción'
              : 'Si continúas se rechazará la invitación para todas las personas que están en esta lista'}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={dialogRef} onClick={onClose}>
              No
            </Button>
            <Button
              ml={3}
              onClick={() =>
                submitConfirmation({
                  rejections: [],
                  statusForAll: true,
                  status: InvitationStatus.Rejected,
                })
              }
            >
              Si, continuar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
