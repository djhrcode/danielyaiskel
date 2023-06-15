import {
  ChakraTheme,
  ThemeConfig,
  ThemeOverride,
  defineStyleConfig,
  extendTheme,
} from '@chakra-ui/react'
import Link from 'next/link'

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: '#FBF4ED',
        color: '#7C4E00',
        fontSize: '14px',
        backgroundImage: 'url(/background.jpg)',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      },
    }),
  },

  colors: {
    brand: {
      default: '#7C4E00',
      100: '#FBF4ED',
      200: '#dcd2bf',
      300: '#b5ac8f',
      400: '#9e8866',
      500: '#614e1e',
      600: '#443307',
    },
  },

  fonts: {
    body: 'Archivo, serif',
    heading: 'Carattere, serif',
  },

  components: {
    Text: defineStyleConfig({
      baseStyle: {
        letterSpacing: '-0.01em',
        fontVariationSettings: '"opsz" 0, "wght" 400, "SOFT" 0, "WONK" 0',
        '& strong': {
          fontWeight: 700,
          fontVariationSettings: '"opsz" 0, "wght" 700, "SOFT" 0, "WONK" 0',
        },
      },
    }),

    Heading: defineStyleConfig({
      baseStyle: {
        fontWeight: 400,
        fontVariationSettings: '"opsz" 80, "wght" 700, "SOFT" 0, "WONK" 1',
        fontFeatureSettings: '"calt" 0',
        fontStyle: 'normal',
        fontOpticalSizing: 'auto',
      },
      variants: {
        light: {
          fontVariationSettings: '"opsz" 80, "wght" 700, "SOFT" 0, "WONK" 1',
        },
        regular: {
          fontVariationSettings: '"opsz" 60, "wght" 700, "SOFT" 0, "WONK" 1',
        },
        bold: {
          fontVariationSettings: '"opsz" 40, "wght" 700, "SOFT" 0, "WONK" 1',
        },
      },
      defaultProps: {
        variant: 'bold',
      },
    }),

    Link: {
      defaultProps: {
        as: Link,
      },
    },

    Checkbox: defineStyleConfig({
      baseStyle: {
        accentColor: '#dfd3bf',
        borderColor: '#dfd3bf',
        bgColor: 'red',
      },

      variants: {
        outlined: {
          borderColor: '#dfd3bf',
        },
      },

      defaultProps: {
        colorScheme: 'brand',
      },
    }),

    Button: defineStyleConfig({
      baseStyle: {
        fontFamily: 'Archivo',
        borderRadius: '15px',
      },

      variants: {
        outline: {
          bg: '#ffffff4f',
          backdropFilter: 'blur(60px)',
          borderColor: '#443307',
          borderWidth: '2px',
          fontWeight: '700',
          _hover: {
            bg: '#ffedf1',
            borderColor: '#443307',
          },
          _focus: {
            bg: '#ffd7e1',
            borderColor: '#2C1C01',
          },
        },
        solid: {
          bg: 'white',
          color: '#443307',
          fontWeight: '700',
          _hover: {
            bg: '#ffeef2',
            borderColor: '#443307',
          },
          _focus: {
            bg: '#ffbdce',
            borderColor: '#443307',
          },
        },
        primary: {
          bg: '#FCAEC2',
          color: '#2C1C01',
          fontWeight: '700',
          _hover: {
            bg: '#ffbdce',
          },
          _focus: {
            bg: '#FCAEC2',
            borderColor: '#ee86a0',
          },
        },
      },
    }),
  },
} as ThemeOverride)

export default theme
