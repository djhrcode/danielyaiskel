import { createIcon } from '@chakra-ui/react'

export const QuestionCircleIcon = createIcon({
  viewBox: '0 0 15 15',
  defaultProps: {
    fontSize: '30px',
  },
  path: (
    <path
      d="M7.5 9V7.5H8A1.5 1.5 0 009.5 6v-.1a1.4 1.4 0 00-1.4-1.4h-.6A1.5 1.5 0 006 6m1 4.5h1m-.5 4a7 7 0 110-14 7 7 0 010 14z"
      stroke="currentColor"
      fill="none"
    ></path>
  ),
})
