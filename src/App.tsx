import { useState, useRef } from 'react'

import {
  useForm,
  FormProvider,
  useFieldArray,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form'

import { DotLottieCommonPlayer, PlayerEvents } from '@dotlottie/react-player'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Flex, ActionIcon, Button, Container, Text, Title, Mark } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconPlus, IconShare, IconTrash } from '@tabler/icons-react'

import styles from './App.module.css'
import GiftBoxOpenLottie from './components/GiftBoxOpenLottie'
import Input from './components/Input'
import useQueryParams from './hooks/useQueryParams'
import { gameSchema, GameSchema } from './schemas/game'
import { randomizeParticipantIndex, randomizeOutcomeIndex } from './utils/game'

interface OutcomeHistory {
  participantName: string
  outcomeName: string
  createdAt: number
}

function App() {
  const queryParams = useQueryParams()
  const clipboard = useClipboard({ timeout: 500 })

  const [outcomeHistory, setOutcomeHistory] = useState<OutcomeHistory[]>([])
  const [showsLottie, setShowsLottie] = useState(false)
  const [outcomeIndicesOfGame, setOutcomeIndicesOfGame] = useState<number[]>([])
  const lottieRef = useRef<DotLottieCommonPlayer>(null)

  const methods = useForm<GameSchema>({
    defaultValues: {
      participants: queryParams.participants
        ? queryParams.participants.split(',').map((name) => ({ value: name.trim() }))
        : [{ value: '하니' }, { value: '해린' }, { value: '민지' }, { value: '다니엘' }],
      outcomes: queryParams.outcomes
        ? queryParams.outcomes.split(',').map((name) => ({ value: name.trim() }))
        : [{ value: '당번' }],
    },
    resolver: zodResolver(gameSchema),
  })

  const {
    fields: participantFields,
    append: participantAppend,
    remove: participantRemove,
  } = useFieldArray({
    control: methods.control,
    name: 'participants',
  })

  const {
    fields: outcomeFields,
    append: outcomeAppend,
    remove: outcomeRemove,
  } = useFieldArray({
    control: methods.control,
    name: 'outcomes',
  })

  const handleResetGame = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    setOutcomeIndicesOfGame([])
  }

  const handleSubmit: SubmitHandler<GameSchema> = (values) => {
    if (outcomeIndicesOfGame.length === values.outcomes.length) {
      handleResetGame()
      return
    }

    setShowsLottie(true)
    const participantResultIndex = randomizeParticipantIndex(values.participants)
    const outcomeResultIndex = randomizeOutcomeIndex(values.outcomes, outcomeIndicesOfGame)

    setOutcomeIndicesOfGame(outcomeIndicesOfGame.concat([outcomeResultIndex]))

    setOutcomeHistory((history) => {
      return [
        {
          participantName: values.participants[participantResultIndex].value,
          outcomeName: values.outcomes[outcomeResultIndex].value,
          createdAt: new Date().getTime(),
        },
      ]
        .concat(history)
        .slice(0, 5)
    })
  }

  const handleSubmitError: SubmitErrorHandler<GameSchema> = (errors) => {
    if (errors.participants?.root?.message) {
      notifications.show({
        title: '에러가 발생했습니다.',
        message: errors.participants?.root?.message,
        color: 'red',
      })
    }

    if (errors.outcomes?.root?.message) {
      notifications.show({
        title: '에러가 발생했습니다.',
        message: errors.outcomes?.root?.message,
        color: 'red',
      })
    }
  }

  const handleShareLink = () => {
    const currentParticipants = methods.getValues('participants')
    const participantsQuery = currentParticipants
      .map((participant) => encodeURIComponent(participant.value))
      .join(',')
    const currentOutcomes = methods.getValues('outcomes')
    const outcomesQuery = currentOutcomes
      .map((outcome) => encodeURIComponent(outcome.value))
      .join(',')

    const currentUrl = window.location.href.split('?')[0] // 기존 쿼리 파라미터 제거
    const newUrl = `${currentUrl}?participants=${participantsQuery}&outcomes=${outcomesQuery}`

    clipboard.copy(newUrl)
    notifications.show({
      title: '공유 링크가 복사되었습니다.',
      message: newUrl,
    })
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit, handleSubmitError)}
        className={styles.container}
      >
        <Container>
          <Stack>
            {/* 당첨자 발표 영역 */}
            <Flex mih={180} justify="center" align="flex-end" direction="row" wrap="nowrap">
              {showsLottie ? (
                <GiftBoxOpenLottie
                  ref={lottieRef}
                  autoplay={true}
                  speed={1.7}
                  onEvent={(event) => {
                    if (event === PlayerEvents.Complete) {
                      setShowsLottie(false)
                    }
                  }}
                />
              ) : outcomeHistory.length ? (
                <Title order={1} title={new Date(outcomeHistory[0].createdAt).toLocaleString()}>
                  <Mark>{outcomeHistory[0].participantName}</Mark>{' '}
                  <Text fw={500} size="sm" span>
                    {outcomeHistory[0].outcomeName}
                  </Text>
                </Title>
              ) : null}
            </Flex>

            {/* 당첨 내역 */}
            <div className={styles.history}>
              {outcomeHistory.length >= 2
                ? outcomeHistory.slice(1).map(({ participantName, outcomeName, createdAt }, i) => {
                    return (
                      <div key={i} title={new Date(createdAt).toLocaleString()}>
                        <Text size="xl" span>
                          <Text fw={700} span>
                            {participantName}
                          </Text>{' '}
                          <Text fw={500} size="sm" span>
                            {outcomeName}
                          </Text>
                        </Text>
                      </div>
                    )
                  })
                : null}
            </div>

            {/* 참가자 입력 */}
            <Flex mih={50} gap="md" justify="center" align="center" direction="row" wrap="nowrap">
              <Flex
                mih={50}
                gap="md"
                justify="center"
                align="center"
                direction="row"
                wrap="nowrap"
                style={{ overflowX: 'scroll' }}
              >
                {participantFields.map((field, index) => (
                  <Input
                    key={field.id}
                    fieldName={`participants.${index}.value`}
                    autoComplete="off"
                    placeholder="이름"
                    style={{ minWidth: 80 }}
                    rightSection={
                      <ActionIcon
                        variant="transparent"
                        color="red"
                        aria-label="삭제"
                        size="xs"
                        onClick={() => participantRemove(index)}
                      >
                        <IconTrash stroke={1.5} />
                      </ActionIcon>
                    }
                  />
                ))}
              </Flex>
              <ActionIcon
                variant="filled"
                aria-label="Add"
                onClick={() => participantAppend({ value: ' ' })}
                disabled={showsLottie}
              >
                <IconPlus stroke={1} />
              </ActionIcon>
            </Flex>

            {/* 당첨 결과 입력 */}
            <Flex mih={50} gap="md" justify="center" align="center" direction="row" wrap="nowrap">
              <Flex
                mih={50}
                gap="md"
                justify="center"
                align="center"
                direction="row"
                wrap="nowrap"
                style={{ overflowX: 'scroll' }}
              >
                {outcomeFields.map((field, index) => (
                  <Input
                    key={field.id}
                    fieldName={`outcomes.${index}.value`}
                    autoComplete="off"
                    placeholder="당첨 결과"
                    style={{ minWidth: 80 }}
                    rightSection={
                      <ActionIcon
                        variant="transparent"
                        color="red"
                        aria-label="삭제"
                        size="xs"
                        onClick={() => outcomeRemove(index)}
                      >
                        <IconTrash stroke={1.5} />
                      </ActionIcon>
                    }
                  />
                ))}
              </Flex>
              <ActionIcon
                variant="filled"
                aria-label="Add"
                onClick={() => outcomeAppend({ value: ' ' })}
                disabled={showsLottie}
              >
                <IconPlus stroke={1} />
              </ActionIcon>
            </Flex>
            {/* 버튼 영역 */}
            <Flex mih={50} gap="md" justify="center" align="center" direction="row" wrap="nowrap">
              {outcomeIndicesOfGame.length === methods.getValues('outcomes').length ? (
                <Button
                  variant="filled"
                  type="button"
                  w={120}
                  disabled={showsLottie}
                  onClick={handleResetGame}
                >
                  다시하기
                </Button>
              ) : (
                <Button variant="filled" type="submit" w={120} disabled={showsLottie}>
                  뽑기
                </Button>
              )}

              <ActionIcon
                variant="default"
                aria-label="Share"
                onClick={handleShareLink}
                title="공유 링크 복사"
              >
                <IconShare stroke={2} />
              </ActionIcon>
            </Flex>
          </Stack>
        </Container>
        <DevTool control={methods.control} />
      </form>
    </FormProvider>
  )
}

export default App
