import { GameSchema } from '../schemas/game'

export const randomizeParticipantIndex = ({
  participants,
  participantIndicesOfGame,
}: {
  participants: GameSchema['participants']
  participantIndicesOfGame: number[]
}): number => {
  // 이미 선택된 인덱스를 제외한 인덱스 목록 생성
  const availableIndices = participants
    .map((_, index) => index)
    .filter((index) => !participantIndicesOfGame.includes(index))

  // 남은 인덱스 중에서 무작위로 하나를 선택
  const randomIndex = Math.floor(Math.random() * availableIndices.length)
  return availableIndices[randomIndex]
}

export const randomizeOutcomeIndex = ({
  outcomes,
  outcomeIndicesOfGame,
}: {
  outcomes: GameSchema['outcomes']
  outcomeIndicesOfGame: number[]
}): number => {
  // 이미 선택된 인덱스를 제외한 인덱스 목록 생성
  const availableIndices = outcomes
    .map((_, index) => index)
    .filter((index) => !outcomeIndicesOfGame.includes(index))

  // 남은 인덱스 중에서 무작위로 하나를 선택
  const randomIndex = Math.floor(Math.random() * availableIndices.length)
  return availableIndices[randomIndex]
}
