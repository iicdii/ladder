export const randomizeParticipantIndex = (participants: string[]): number => {
  return Math.floor(Math.random() * participants.length)
}
