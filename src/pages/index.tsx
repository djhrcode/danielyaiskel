/* eslint-disable react/no-unescaped-entities */
import {
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
  Spacer,
  Stack,
  Text,
  keyframes,
  useBreakpoint,
  useDisclosure,
} from '@chakra-ui/react'
import { ArrowForwardIcon, HamburgerIcon } from '@chakra-ui/icons'
import styled from '@emotion/styled'
import { Drawer } from '@chakra-ui/react'
import {
  ArrowRightIcon,
  HeartIcon,
  PinIcon,
  QuestionCircleIcon,
} from '@/shared/ui/icons'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Invitation } from '@/shared/domain/invitation'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { GuestGenre } from '@/shared/domain/guest_genre'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'

const Heart = styled(HeartIcon)({
  fontSize: '0.5em',
})

const TextDivider = styled(Divider)({
  borderColor: '#443307',
  borderWidth: '1px',
})

function padZero(num: number): string {
  return num.toString().padStart(2, '0')
}

const spin = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg)}
`

function getTimeLeft(targetDate: Date): string {
  const now = new Date()
  const timeDifference = targetDate.getTime() - now.getTime()
  if (timeDifference <= 0) {
    return '00 d 00 h 00 m 00 s' // If target date has already passed
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

  return `${padZero(days)} días ${padZero(hours)} hrs  ${padZero(
    minutes
  )} min ${padZero(seconds)} segs`
}

export function NavCounter() {
  const dateTimeTo = dayjs('2023-05-13 10:30 am')

  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const interval = setInterval(
      () => setTimeLeft(getTimeLeft(dateTimeTo.toDate())),
      1000
    )
    return () => clearInterval(interval)
  })

  return <>{timeLeft}</>
}
type UseFetchOptions = {
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE'
  body?: Record<string, any>
  headers?: Record<string, string>
}

function useFetch<Response = {}>(url: string, options?: UseFetchOptions) {
  const [data, setData] = useState<Response | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    try {
      setLoading(true)

      const response = await fetch(url, {
        method: options?.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(options?.headers ?? {}),
        },
        body: JSON.stringify(options?.body),
      })

      if (!response.ok) throw new Error(response.statusText)

      setData(await response.json())
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [url, options])

  return {
    execute,
    data,
    isLoading: loading,
    hasError: !!error,
  }
}

export default function Home() {
  const { query } = useRouter()
  const { key } = query

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY || '',
  })

  //10.471431,-66.151268
  //10.4767208,-66.1750094,13.97z
  const center = useMemo(() => ({ lat: 10.471431, lng: -66.151268 }), [])
  const customMarker = {
    path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
    fillColor: 'red',
    fillOpacity: 2,
    strokeWeight: 1,
    rotation: 0,
    scale: 1,
  }

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

  const {
    value: invitationValue,
    setValue: setInvitationStorage,
    hasValue: hasInvitationStorage,
  } = useLocalStorage<Invitation>('invitation-data')

  const { execute, data: response } = useFetch<{ data: Invitation }>(
    `/api/invitations/${keyValue}`
  )

  useEffect(() => {
    if (key && keyValue && key !== keyValue) {
      setKeyStorage(null)
      setTokenStorage(null)
      setInvitationStorage(null)
      return
    }

    if (key) setKeyStorage(key as string)
  }, [key, keyValue])

  useEffect(() => {
    if (keyValue && !hasInvitationStorage()) execute()
  }, [keyValue])

  useEffect(() => {
    if (response?.data) setInvitationStorage(response?.data)
  }, [response])

  const hasSingleGuest = () => invitationValue?.guests?.length === 1

  const firstGuestIsMale = () =>
    invitationValue?.guests?.[0]?.genre === GuestGenre.Male

  return (
    <>
      <Stack
        direction="column"
        align="center"
        minHeight="calc(100vh - 240px)"
        sx={{
          overflow: 'hidden',
        }}
      >
        <Stack zIndex="10" direction="column" align="center" spacing="4">
          <Box position="absolute" mt="-12">
            <Image
              width={350}
              height={350}
              alt="ivanna figueroa picture"
              src="/ivanna-picture.png"
            />
          </Box>

          <Box height="200px"></Box>

          <Heading variant="light" size="3xl">
            Ivanna Figueroa
          </Heading>

          <Text fontSize="1.25em" my="6" textAlign="center" px="4">
            <strong>¡Me gradué!</strong> Acompáñame a celebrarlo en mi{' '}
            <strong>fiesta de graduación.</strong>
          </Text>

          <TextDivider width="140px" />

          <Heading mt="2" mb="3" size="lg" fontFamily="Archivo">
            SÁB | 24 / JUN / 2023 - 4 PM
          </Heading>

          <TextDivider width="140px" />

          {(invitationValue?.guests?.length ?? 0) >= 1 && (
            <Button
              as={Link}
              href={hasTokenStorage() ? '/confirm' : '/confirm/verify'}
              rightIcon={<ArrowRightIcon fontSize="28px" />}
              variant="outline"
              size="lg"
            >
              Confirmar asistencia
            </Button>
          )}
          <Spacer></Spacer>
        </Stack>
      </Stack>

      <Stack direction="column" align="center">
        <TextDivider width="140px" />
        <Heading variant="light" size="xl" pt="12">
          ¿Cómo llegar al evento?
        </Heading>
        <Text
          variant="regular"
          fontSize="1.25em"
          my="6"
          pb="12"
          textAlign="center"
          px="4"
        >
          Te dejamos acá la ubicación exacta para que no te pierdas en el camino
          ;)
        </Text>
        <Box sx={{ w: '100vw', h: '400px', maxW: '720px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d753.2048082553358!2d-75.96810113038399!3d40.96353871091429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c5a43e6f6e8981%3A0x6cf608c03e4f4a38!2s225%20E%204th%20St%2C%20Hazleton%2C%20PA%2018201%2C%20EE.%20UU.!5e0!3m2!1ses!2sco!4v1686812685028!5m2!1ses!2sco"
            width="100%"
            height="400"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Box>
        <Box py="10">
          <Button
            as={Link}
            href="https://goo.gl/maps/hBadFDaQWSarW5FM9"
            target="_blank"
            rightIcon={<PinIcon fontSize="20px" />}
            variant="outline"
            size="lg"
          >
            Ver en Google Maps
          </Button>
        </Box>
      </Stack>

      <Stack direction="column" align="center">
        <TextDivider width="140px" />
        <Heading variant="regular" size="xl" pt="12" px="6" textAlign="center">
          ¿Tienes otras dudas sobre el evento?
        </Heading>
        <Text fontSize="1.25em" my="6" px="6" textAlign="center">
          Visita nuestra sección de "Preguntas frecuentes" donde hemos preparado
          la mayoría de respuestas a las dudas que te pueden llegar surgir
        </Text>
        <Box pt="6" pb="10">
          <Button
            as={Link}
            href="/faq"
            rightIcon={<QuestionCircleIcon fontSize="20px" />}
            variant="outline"
            size="lg"
          >
            Ver preguntas frecuentes
          </Button>
        </Box>

        <TextDivider width="140px" />

        <Box py="12">
          <Heading variant="light">Ivanna Figueroa</Heading>
        </Box>
      </Stack>
    </>
  )
}
