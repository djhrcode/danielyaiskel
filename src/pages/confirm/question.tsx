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
import { ArrowRightIcon, HeartIcon } from '@/shared/ui/icons'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const Heart = styled(HeartIcon)({
  fontSize: '0.5em',
})

const TextDivider = styled(Divider)({
  borderColor: '#443307',
  borderWidth: '1px',
  borderStyle: 'dashed',
})

const OptionListItem = styled(ListItem)({
  borderColor: '#dfd3bf',
  color: '#443307',
  backgroundColor: '#ffffff76',
  fontSize: '1.25em',
  fontWeight: 600,
  padding: '0.5em 1em',
  borderWidth: '1px',
  borderRadius: '0.5em',
  minWidth: '360px',
  marginBottom: '0.5em',
})

export default function Home() {
  const { query } = useRouter()

  return (
    <>
      <Stack direction="column" align="center" spacing="4">
        <Heading
          color="#a97900"
          variant="light"
          size="xl"
          textAlign="center"
        ></Heading>

        <Text fontSize="1.25em" my="6" textAlign="center" px="4">
          ¿Alguno de tus invitados tiene alergías por la comida de mar?
          (mariscos, moluscos, pescado, etc)
        </Text>

        <List>
          <OptionListItem>No, ninguno</OptionListItem>
          <OptionListItem>Omaris Segovia</OptionListItem>
          <OptionListItem>Sofía Gonzáles</OptionListItem>
          <OptionListItem>Ali Gonzáles</OptionListItem>
          <OptionListItem>Moraima Romero</OptionListItem>
          <OptionListItem>Omar Segovia</OptionListItem>
          <OptionListItem>Carmen Mata</OptionListItem>
          <OptionListItem>Maximiliano Romero</OptionListItem>
        </List>

        <Button
          as={Link}
          href="/confirm"
          rightIcon={<ArrowRightIcon fontSize="28px" />}
          size="lg"
          variant="outline"
        >
          Continuar
        </Button>
      </Stack>
    </>
  )
}
