import { z } from 'zod'

export const gameSchema = z.object({
  participants: z.array(z.string().min(1, { message: '이름을 입력해주세요.' })),
  outcome: z.string().min(1, { message: '결과를 입력해주세요.' }),
})
export type GameSchema = z.infer<typeof gameSchema>
