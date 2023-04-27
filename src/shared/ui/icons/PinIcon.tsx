import { createIcon } from '@chakra-ui/react'

export const PinIcon = createIcon({
  viewBox: '0 0 15 15',
  defaultProps: {
    fontSize: '30px',
  },
  path: (
    <>
      <path
        clipRule="evenodd"
        d="M7.5 8.495a2 2 0 002-1.999 2 2 0 00-4 0 2 2 0 002 1.999z"
        stroke="currentColor"
        fill="none"
        strokeLinecap="square"
      ></path>
      <path
        clipRule="evenodd"
        d="M13.5 6.496c0 4.997-5 7.995-6 7.995s-6-2.998-6-7.995A5.999 5.999 0 017.5.5c3.313 0 6 2.685 6 5.996z"
        stroke="currentColor"
        fill="none"
        strokeLinecap="square"
      ></path>
    </>
  ),
})
