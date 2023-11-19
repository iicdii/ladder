import { forwardRef } from 'react'

import {
  DotLottiePlayer,
  Props as DotLottieProps,
  DotLottieCommonPlayer,
} from '@dotlottie/react-player'

import styles from './GiftBoxOpenLottie.module.css'

interface GiftBoxOpenLottieProps extends Omit<DotLottieProps, 'src'> {}

const GiftBoxOpenLottie = forwardRef<DotLottieCommonPlayer, GiftBoxOpenLottieProps>(
  (props, ref) => {
    return (
      <div className={styles.container}>
        <DotLottiePlayer src="/gift_box_open.lottie" {...props} ref={ref} />
      </div>
    )
  },
)

export default GiftBoxOpenLottie
