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
} from '@chakra-ui/react'
import { ArrowForwardIcon, HamburgerIcon } from '@chakra-ui/icons'
import styled from '@emotion/styled'
import { Drawer } from '@chakra-ui/react'
import {
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

const OptionListItem = styled(ListItem)<OptionProps>(({ checked }) => ({
  borderColor: checked ? '#443307' : '#dfd3bf',
  color: '#443307',
  backgroundColor: '#ffffff76',
  fontFamily: 'DM Sans',
  fontSize: '1.25em',
  fontWeight: 400,
  padding: '0.5em 1em',
  borderWidth: '1px',
  borderRadius: '0.5em',
  minWidth: '360px',
  marginBottom: '0.5em',
  display: 'flex',
  alignItems: 'center',
}))

function ListOption({ selectable, checked, children, onChange }: OptionProps) {
  const [isChecked, setIsChecked] = useState(checked)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event
    const newValue = target.value === 'true'

    setIsChecked(newValue)
    onChange?.(newValue)
  }

  useEffect(() => setIsChecked(checked), [checked])

  return (
    <OptionListItem>
      {selectable && (
        <Checkbox
          isChecked={isChecked}
          onChange={handleChange}
          mr="3"
          borderColor="#9e8866"
        ></Checkbox>
      )}
      {children}
    </OptionListItem>
  )
}

export default function Home() {
  const { query: { select = false } = {} } = useRouter()
  const { isOpen, onClose, onOpen } = useDisclosure()

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

  const dialogRef = useRef<HTMLButtonElement | null>(null)

  const selectable = useMemo(() => select === 'true', [select])

  return (
    <>
      <Stack direction="column" align="center" spacing="4" py="6">
        <Heading variant="regular" size="xl" textAlign="center">
          ¿Nos acompañan?
        </Heading>

        <Text fontSize="1.25em" my="6" textAlign="center" px="4">
          Tienes 7 invitados. Por favor, indícanos si todos los invitados que
          hemos incluido asistirán a la boda
        </Text>

        <List>
          <ListOption selectable={selectable}>Sofía Gonzáles</ListOption>
          <ListOption selectable={selectable}>Ali Gonzáles</ListOption>
          <ListOption selectable={selectable}>Moraima Romero</ListOption>
          <ListOption selectable={selectable}>Omar Segovia</ListOption>
          <ListOption selectable={selectable}>Carmen Mata</ListOption>
          <ListOption selectable={selectable}>Maximiliano Romero</ListOption>
        </List>

        <Button
          as={Link}
          href="/confirm"
          rightIcon={<TickIcon fontSize="24px" />}
          size="lg"
          variant="outline"
        >
          Si, confirmar a todos
        </Button>

        <Button
          as={Link}
          href={`/confirm?select=true`}
          rightIcon={<ListLayoutIcon fontSize="24px" />}
          size="lg"
        >
          Confirmar algunos
        </Button>

        <Button
          as={Link}
          color="#a91c00"
          rightIcon={<CloseIcon fontSize="20px" />}
          size="lg"
          variant="link"
          onClick={onOpen}
        >
          No podemos asistir
        </Button>
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
            Si continúas se rechazará la invitación para todas las personas que
            están en esta lista
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={dialogRef} onClick={onClose}>
              No
            </Button>
            <Button ml={3}>Si, continuar</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
