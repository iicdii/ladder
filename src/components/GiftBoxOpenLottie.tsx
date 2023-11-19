import { forwardRef } from 'react'

import {
  DotLottiePlayer,
  Props as DotLottieProps,
  DotLottieCommonPlayer,
} from '@dotlottie/react-player'
import { Box } from '@mantine/core'

interface GiftBoxOpenLottieProps extends Omit<DotLottieProps, 'src'> {}

const GiftBoxOpenLottie = forwardRef<DotLottieCommonPlayer, GiftBoxOpenLottieProps>(
  (props, ref) => {
    return (
      <Box w={320} h={180}>
        <DotLottiePlayer src="/gift_box_open.lottie" {...props} ref={ref} />
      </Box>
    )
  },
)

export default GiftBoxOpenLottie
