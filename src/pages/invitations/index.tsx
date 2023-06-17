import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
  Input,
  InputLeftElement,
  Link,
  List,
  ListItem,
  PinInput,
  PinInputField,
  Spacer,
  Stack,
  Tag,
  Text,
  useBreakpoint,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { ArrowForwardIcon, HamburgerIcon, SearchIcon } from '@chakra-ui/icons'
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
import { InputGroup } from '@chakra-ui/react'

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
    fontSize: '1em',
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

const InvitationStatusColor = {
  [InvitationStatus.Pending]: 'orange',
  [InvitationStatus.Accepted]: 'green',
  [InvitationStatus.Rejected]: 'red',
  [InvitationStatus.Canceled]: 'red',
}

const InvitationStatusTexts = {
  [InvitationStatus.Pending]: 'Pendiente',
  [InvitationStatus.Accepted]: 'Aceptado',
  [InvitationStatus.Rejected]: 'Rechazado',
  [InvitationStatus.Canceled]: 'Cancelado',
}

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

function debounce<T extends (...args: any[]) => void>(callback: T): T {
  let timer: NodeJS.Timeout | null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      callback.apply(null, args)
    }, 500)
  } as T
}

export default function Home() {
  const { query: { select = false } = {}, push: navigateTo } = useRouter()
  const { isOpen, onClose, onOpen } = useDisclosure()

  const [searchResults, setSearchResults] = useState<Invitation[]>([])
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)

  const clearSearchInput = () => setSearchQuery(undefined)

  const {
    setValue: setInvitationStorage,
    value: invitation,
    hasValue: hasInvitationStorage,
  } = useLocalStorage<Invitation>('invitation-data')

  const {
    setValue: setTokenStorage,
    value: tokenValue,
    hasValue: hasTokenStorage,
  } = useLocalStorage<string>('invitation-token')

  const launchToast = useToast()

  const queryInvitations = debounce(
    async ({
      query,
      page = 1,
      perPage = 20,
    }: {
      query?: string
      page?: number
      perPage?: number
    }) => {
      const searchParams = new URLSearchParams(
        Object.entries({
          query,
          page,
          perPage,
        }).filter(([key, value]) => value) as string[][]
      )

      const response = await fetch(
        `/api/invitations?${searchParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${tokenValue}`,
          },
        }
      )

      if (!response.ok)
        return launchToast({
          title: 'Ha ocurrido un error',
          description:
            'No pudimos realizar esta consulta, por favor intente más tarde',
          status: 'error',
          duration: 8000,
          isClosable: true,
        })

      const { data = [] } = (await response.json()) ?? {}

      setSearchResults(data)
    }
  )

  useEffect(() => {
    queryInvitations({ query: searchQuery })
  }, [searchQuery])

  return (
    <>
      <Stack direction="column" align="center" spacing="4" py="6">
        <Heading variant="regular" size="xl" textAlign="center">
          Busca tu invitación
        </Heading>

        <Text as="div" fontSize="1.25em" my="6" textAlign="center" px="4">
          Usa este buscador para encontrar tu invitación y verificar el estado
        </Text>

        <Accordion
          maxWidth="600px"
          width="100%"
          allowToggle
          padding="16px"
          borderRadius="8px"
          backgroundColor="#fff5f1"
        >
          <InputGroup marginBottom="16px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon />
            </InputLeftElement>
            <Input
              _placeholder={{ color: 'inherit', opacity: 0.4 }}
              _focus={{
                boxShadow: 'none',
                backgroundColor: 'white',
                borderWidth: '2px',
                borderColor: 'currentcolor',
              }}
              placeholder="Busca por nombre o apellido"
              onChange={({ target: { value } }) => {
                queryInvitations({ query: value })
              }}
            />
          </InputGroup>

          {searchResults.map((invitation) => (
            <AccordionItem key={invitation.id}>
              <h2>
                <AccordionButton fontSize="lg" py="4" fontWeight={600}>
                  <Box as="span" flex="1" textAlign="left">
                    {invitation.name} ({invitation.guests.length} invitados)
                    <Tag
                      colorScheme={InvitationStatusColor[invitation.status]}
                      marginLeft="10px"
                    >
                      {InvitationStatusTexts[invitation.status]}
                    </Tag>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel
                pb={4}
                fontSize="md"
                display="flex"
                flexDirection="column"
              >
                {invitation && (
                  <>
                    <List>
                      {invitation?.guests.map(
                        (
                          { id: guestId, first_name, last_name, status },
                          index
                        ) => (
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
                          >
                            {first_name} {last_name}
                            <Tag
                              colorScheme={InvitationStatusColor[status]}
                              marginLeft="10px"
                            >
                              {InvitationStatusTexts[status]}
                            </Tag>
                          </ListOption>
                        )
                      )}
                    </List>
                    <Button
                      as={Link}
                      href={`/?key=${invitation.key}`}
                      rightIcon={<ArrowRightIcon fontSize="24px" />}
                      size="md"
                      variant="solid"
                      alignSelf="center"
                    >
                      Ir a confirmar invitación
                    </Button>
                  </>
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        <Button
          as={Link}
          href="/"
          rightIcon={<ArrowLeftIcon fontSize="24px" />}
          size="lg"
          variant="outline"
        >
          Volver al inicio
        </Button>
      </Stack>
    </>
  )
}
