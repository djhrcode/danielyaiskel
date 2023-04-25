import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Icon,
  IconButton,
  Link,
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
import { ArrowRightIcon, HeartBrokenIcon, HeartIcon } from '@/shared/ui/icons'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { AlertDialogOverlay } from '@chakra-ui/react'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'

const Heart = styled(HeartIcon)({
  fontSize: '0.5em',
})

const TextDivider = styled(Divider)({
  borderColor: '#443307',
  borderWidth: '1px',
  borderStyle: 'dashed',
})

const OtpInputField = styled(PinInputField)({
  color: '#443307',
  borderColor: '#917e4f',
  fontSize: '24px',

  '::placeholder': {
    color: '#443307',
  },

  ':hover': {
    borderColor: '#dacfb0',
  },

  ':not(:placeholder-shown)': {
    backgroundColor: 'white',
  },

  ':focus': {
    boxShadow: '0 0 0px 2px #af7e01',
    borderColor: '#af7e01',
    backgroundColor: 'white',
  },
})

export default function Home() {
  const { query, push: navigateTo } = useRouter()
  const [otpCode, setOtpCode] = useState('')
  const { isOpen, onClose, onOpen } = useDisclosure()

  const dialogRef = useRef<HTMLButtonElement | null>()

  const toast = useToast()

  const {
    setValue: setInvitationStorage,
    value: invitationValue,
    hasValue: hasInvitationStorage,
  } = useLocalStorage<string>('invitation-data')

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

  const verifyCode = async () => {
    const response = await fetch(`/api/invitations/${keyValue}/verify`, {
      method: 'POST',
      body: JSON.stringify({ code: otpCode }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    if (!response.ok)
      return toast({
        title: 'Ha ocurrido un error',
        description: 'No pudimos verificar correctamente tu código',
        status: 'error',
        duration: 8000,
        isClosable: true,
      })

    const json = await response.json()

    if (!json || !json?.data?.token || !json?.data?.invitation)
      return toast({
        title: 'Ha ocurrido un error',
        description: 'No pudimos verificar correctamente tu código',
        status: 'error',
        duration: 8000,
        isClosable: true,
      })

    setTokenStorage(json?.data?.token)
    setInvitationStorage(json?.data?.invitation)

    toast({
      title: 'Verificación completada',
      description: 'Te llevaremos a confirmar tus invitados',
      status: 'success',
      duration: 8000,
      isClosable: true,
    })

    navigateTo({
      pathname: '/confirm',
    })
  }

  return (
    <>
      <Stack direction="column" align="center" spacing="4" py="8">
        <Box>
          <HeartBrokenIcon fontSize="48px" />
        </Box>

        <Heading variant="regular" size="xl" textAlign="center">
          Lamentamos que no nos puedas acompañar :(
        </Heading>

        <Text fontSize="1.25em" my="6" textAlign="center" px="4">
          Ten por seguro que nos harás mucha falta. De igual forma, gracias por
          formar parte de nuestras historias
        </Text>

        <Box pt="6">
          <Button
            as={Link}
            href="/"
            rightIcon={<ArrowRightIcon fontSize="28px" />}
            variant="link"
            color="#443307"
            size="lg"
          >
            Volver al inicio
          </Button>
        </Box>
      </Stack>
    </>
  )
}
