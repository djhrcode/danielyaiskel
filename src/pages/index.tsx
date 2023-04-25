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
import { ArrowRightIcon, HeartIcon } from '@/shared/ui/icons'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { Invitation } from '@/shared/domain/invitation'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'

const Heart = styled(HeartIcon)({
  fontSize: '0.5em',
})

const TextDivider = styled(Divider)({
  borderColor: '#443307',
  borderWidth: '1px',
  borderStyle: 'dashed',
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

  const { execute, data: response } = useFetch<{ data: Invitation }>(
    `http://localhost:3000/api/invitations/${key}`
  )

  useEffect(() => {
    if (key) execute()
  }, [key, execute])

  useEffect(() => {
    if (response?.data) setKeyStorage(key as string)
  }, [response, key])

  return (
    <>
      <Stack
        direction="column"
        align="center"
        minHeight="calc(100vh - 120px)"
        sx={{
          overflow: 'hidden',
          _after: {
            content: '""',
            position: 'relative',
            top: '-40px',
            width: '360px',
            height: '360px',
            bgImage: 'url(/sunflower.png)',
            bgSize: 'contain',
            animation: `${spin} infinite 45s ease-in-out`,
            zIndex: '0',
          },
        }}
      >
        <Stack zIndex="10" direction="column" align="center" spacing="4">
          <Box position="absolute" mt="-12">
            <Image
              width={200}
              height={200}
              alt="daniel y aiskel picture"
              src="/da-cover.png"
            />
          </Box>

          <Box height="150px"></Box>

          <Heading variant="light" size="2xl">
            Daniel <Heart>♥</Heart> Aiskel
          </Heading>

          <Text fontSize="1.25em" my="6" textAlign="center" px="4">
            {response?.data ? (
              <>
                Queridos amigos <strong>{response.data.name}</strong>, deseamos
                invitarlos a nuestra boda
              </>
            ) : (
              <>
                ¡Nos casamos! Y deseamos que nos acompañes en este momento tan
                especial
              </>
            )}
          </Text>

          <TextDivider width="140px" />

          <Heading mt="2" mb="3" size="lg">
            SÁB | 13 / MAY / 23
          </Heading>

          <TextDivider width="140px" />

          <Text fontSize="1.25em" my="6" textAlign="center">
            <span>10:30 AM - Hotel Castillo Alejandría </span> <br />
            <span>Higuerote - Vía Curiepe</span>
          </Text>

          <Button
            as={Link}
            href={hasTokenStorage() ? '/confirm' : '/confirm/verify'}
            rightIcon={<ArrowRightIcon fontSize="28px" />}
            variant="outline"
            size="lg"
          >
            Confirmar asistencia
          </Button>

          <Spacer></Spacer>
        </Stack>
      </Stack>
    </>
  )
}
