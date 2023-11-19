import { useState, useRef } from 'react'

import { useForm, FormProvider, useFieldArray, SubmitHandler } from 'react-hook-form'

import { DotLottieCommonPlayer, PlayerEvents } from '@dotlottie/react-player'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Flex, ActionIcon, Button, Container, Text, Title, Mark } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconPlus, IconShare } from '@tabler/icons-react'

import styles from './App.module.css'
import GiftBoxOpenLottie from './components/GiftBoxOpenLottie'
import Input from './components/Input'
import useQueryParams from './hooks/useQueryParams'
import { gameSchema, GameSchema } from './schemas/game'
import { randomizeParticipantIndex } from './utils/game'

interface OutcomeHistory {
  participantName: string
  outcome: string
  createdAt: number
}

function App() {
  const queryParams = useQueryParams()
  const defaultParticipants = queryParams.participants
    ? queryParams.participants.split(',').map((name) => ({ value: name.trim() }))
    : [{ value: '하니' }, { value: '해린' }, { value: '민지' }, { value: '다니엘' }]
  const clipboard = useClipboard({ timeout: 500 })

  const [outcomeHistory, setOutcomeHistory] = useState<OutcomeHistory[]>([])
  const [showsLottie, setShowsLottie] = useState(false)
  const lottieRef = useRef<DotLottieCommonPlayer>(null)

  const methods = useForm<GameSchema>({
    defaultValues: {
      participants: defaultParticipants,
      outcome: '당번',
    },
    resolver: zodResolver(gameSchema),
  })

  const { fields: participantFields, append: participantAppend } = useFieldArray({
    control: methods.control,
    name: 'participants',
  })

  const handleSubmit: SubmitHandler<GameSchema> = (values) => {
    setShowsLottie(true)
    const result = randomizeParticipantIndex(values.participants)
    setOutcomeHistory((history) => {
      return [
        {
          participantName: values.participants[result].value,
          outcome: values.outcome,
          createdAt: new Date().getTime(),
        },
      ]
        .concat(history)
        .slice(0, 5)
    })
  }

  const handleShareLink = () => {
    const currentParticipants = methods.getValues('participants')
    const participantsQuery = currentParticipants
      .map((participant) => encodeURIComponent(participant.value))
      .join(',')

    const currentUrl = window.location.href.split('?')[0] // 기존 쿼리 파라미터 제거
    const newUrl = `${currentUrl}?participants=${participantsQuery}`

    clipboard.copy(newUrl)
    notifications.show({
      title: '공유 링크가 복사되었습니다.',
      message: newUrl,
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className={styles.container}>
        <Container>
          <Stack>
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
                    {outcomeHistory[0].outcome}
                  </Text>
                </Title>
              ) : null}
            </Flex>
            <div className={styles.history}>
              {outcomeHistory.length >= 2
                ? outcomeHistory.slice(1).map(({ participantName, outcome, createdAt }, i) => {
                    return (
                      <div key={i} title={new Date(createdAt).toLocaleString()}>
                        <Text size="xl" span>
                          <Text fw={700} span>
                            {participantName}
                          </Text>{' '}
                          <Text fw={500} size="sm" span>
                            {outcome}
                          </Text>
                        </Text>
                      </div>
                    )
                  })
                : null}
            </div>
            <Flex
              mih={50}
              gap="md"
              justify="flex-start"
              align="flex-start"
              direction="row"
              wrap="nowrap"
            >
              {participantFields.map((field, index) => (
                <Input
                  key={field.id}
                  fieldName={`participants.${index}.value`}
                  autoComplete="off"
                  placeholder="이름"
                />
              ))}
              <ActionIcon
                variant="filled"
                aria-label="Add"
                onClick={() => participantAppend({ value: ' ' })}
                disabled={showsLottie}
              >
                <IconPlus stroke={1} />
              </ActionIcon>
            </Flex>
            <div className={styles.outcomesWrapper}>
              <Input fieldName="outcome" placeholder="당첨 결과" autoComplete="off" />
            </div>
            <Flex mih={50} gap="md" justify="center" align="center" direction="row" wrap="nowrap">
              <Button variant="filled" type="submit" w={120} disabled={showsLottie}>
                시작
              </Button>

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
