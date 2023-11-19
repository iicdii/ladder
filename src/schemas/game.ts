import { z } from 'zod'

const stringFieldSchema = z
  .string()
  .min(1, { message: '필수항목 입니다.' })
  .regex(/^[^!@#$%^&*()+=._,-]+$/, { message: '특수문자를 사용할 수 없습니다.' })

export const gameSchema = z.object({
  participants: z
    .array(
      z.object({
        value: stringFieldSchema,
      }),
    )
    .min(1, { message: '최소 1명의 참가자가 필요합니다.' }),
  outcomes: z
    .array(
      z.object({
        value: stringFieldSchema,
      }),
    )
    .min(1, { message: '최소 1개의 결과가 필요합니다.' }),
})

export type GameSchema = z.infer<typeof gameSchema>
