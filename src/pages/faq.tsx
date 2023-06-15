/* eslint-disable react/no-unescaped-entities */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
import {
  ArrowRightIcon,
  HeartBrokenIcon,
  HeartIcon,
  QuestionCircleIcon,
} from '@/shared/ui/icons'
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
          <QuestionCircleIcon fontSize="48px" />
        </Box>

        <Heading variant="regular" size="xl" textAlign="center">
          ¿Tienes dudas?
        </Heading>

        <Text variant="regular" fontSize="lg" textAlign="center">
          Hemos respondido algunas preguntas frecuentes para ti
        </Text>
        <Accordion maxWidth="600px" allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton fontSize="lg" py="4" fontWeight={600}>
                <Box as="span" flex="1" textAlign="left">
                  ¿Que tipo de vestimenta debo usar?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize="md">
              En vista de la ocasión, esperamos que la vestimenta sea formal.
              Sin embargo no tiene porque ser algo demasiado costoso o
              llamativo, sino modesto y sencillo.
              <br />
              <br />
              Aunque no hay normas específicas, esperamos que nadie use{' '}
              <strong>ropa muy reveladora o transparente</strong> o cualquier
              tipo de vestimenta llame demasiado la atención o que pueda
              incomodar a los invitados
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton fontSize="lg" py="4" fontWeight={600}>
                <Box as="span" flex="1" textAlign="left">
                  Si yo no puedo asistir, ¿le puedo ceder mi invitación a otra
                  persona?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize="md">
              No, la invitación envíada es intransferible y únicamente válida
              para las personas que figuran en el cupo de la misma
              <br />
              <br />
              <strong>Si ninguno de los invitados pueden asistir</strong>,
              puedes rechazar la invitación en este mismo sitio web
              <br />
              <br />
              <strong>Si algunos de los invitados no puede asistir</strong>,
              puedes usar la opción "Confirmar algunos" y seleccionar los que si
              pueden asistir
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton fontSize="lg" py="4" fontWeight={600}>
                <Box as="span" flex="1" textAlign="left">
                  Confirmé asistencia pero no podré asistir ¿que debo hacer?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize="md">
              Puedes usar el enlace que te enviamos inicialmente para modificar
              tu confirmación.
              <br />
              <br />
              <strong>Si ninguno de los invitados podrá asistir</strong>, al
              ingresar al enlace debes dar click en la opción "Cancelar
              asistencia"
              <br />
              <br />
              <strong>Si solo algunos de los invitados podrá asistir</strong>,
              al ingresar al enlace debes dar click en la opción "Modificar
              asistencia" y seleccionar quienes podrán asistir
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Box pt="6">
          <Button
            as={Link}
            href="/"
            rightIcon={<ArrowRightIcon fontSize="28px" />}
            variant="solid"
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
