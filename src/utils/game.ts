import { GameSchema } from '../schemas/game'

export const randomizeParticipantIndex = (participants: GameSchema['participants']): number => {
  return Math.floor(Math.random() * participants.length)
}
