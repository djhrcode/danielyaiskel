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
  useBreakpoint,
  useDisclosure,
} from '@chakra-ui/react'
import { ArrowForwardIcon, HamburgerIcon } from '@chakra-ui/icons'
import styled from '@emotion/styled'
import { Drawer } from '@chakra-ui/react'
import {
  ArrowRightIcon,
  CloseIcon,
  GraduationIcon,
  HeartIcon,
} from '@/shared/ui/icons'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const NavHeadingIcon = styled(GraduationIcon)({
  fontSize: '0.8em',
  marginRight: '0.1em',
  marginLeft: '0.2em',
})

const NavHeading = styled(Heading)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.75em',
})

const NavItems = styled(Box)({
  display: 'flex',
  height: '60px',
  padding: '0 1.5em',
  alignItems: 'center',
})

const NavBox = styled(Box)({
  display: 'flex',
  height: '60px',
  padding: '0 1.5em',
  backgroundColor: 'white',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const NavLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 1.5em',
})

const NavMenuButton = styled(IconButton)({
  fontSize: '24px',

  backgroundColor: '#FFFFFF',

  ':hover': {
    backgroundColor: '#FBF4ED',
  },
})

export function Navigation() {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <NavBox zIndex="modal">
      <NavHeading fontFamily="Archivo">
        I <NavHeadingIcon /> F
      </NavHeading>

      <Box>
        <NavMenuButton
          aria-label="menu icon"
          icon={<HamburgerIcon />}
          onClick={onOpen}
        ></NavMenuButton>
      </Box>

      <Drawer
        placement="right"
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick
      >
        <DrawerOverlay />
        <DrawerContent
          sx={{
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <DrawerHeader borderBottomWidth="1px">
            <Stack direction="row">
              <IconButton
                opacity={0}
                aria-label="hidden close menu btn"
                icon={<CloseIcon fontSize="24px" />}
              ></IconButton>
              <Spacer />
              <NavHeading>
                <Heading variant="light">Ivanna Figueroa</Heading>
              </NavHeading>
              <Spacer />
              <IconButton
                onClick={onClose}
                aria-label="close menu btn"
                icon={<CloseIcon fontSize="24px" />}
              ></IconButton>
            </Stack>
          </DrawerHeader>
          <DrawerBody fontSize="24px">
            <Stack spacing="4">
              <Button
                href="/"
                size="lg"
                fontSize="20px"
                fontWeight={400}
                as={NavLink}
              >
                Inicio
              </Button>
              <Button
                href="/confirm/verify"
                size="lg"
                fontSize="20px"
                fontWeight={400}
                as={NavLink}
              >
                Confirmar asistencia
              </Button>
              <Button
                href="/faq"
                size="lg"
                fontSize="20px"
                fontWeight={400}
                as={NavLink}
              >
                Preguntas frecuentes
              </Button>
              <Button
                isDisabled
                size="lg"
                fontSize="20px"
                fontWeight={400}
                as={NavLink}
              >
                Programación (pronto)
              </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </NavBox>
  )
}
