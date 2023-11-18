import { useState } from 'react'

import { useForm, FormProvider, useFieldArray, SubmitHandler } from 'react-hook-form'

import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Flex, ActionIcon, Button, Container, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

import styles from './App.module.css'
import Input from './components/Input'
import { gameSchema, GameSchema } from './schemas/game'
import { randomizeParticipantIndex } from './utils/game'

interface OutcomeHistory {
  participantName: string
  outcome: string
  createdAt: number
}

function App() {
  const [outcomeHistory, setOutcomeHistory] = useState<OutcomeHistory[]>([])
  const methods = useForm<GameSchema>({
    defaultValues: {
      participants: ['하니', '해린', '민지', '다니엘'],
      outcome: '당번',
    },
    resolver: zodResolver(gameSchema),
  })

  const { fields: participantFields, append: participantAppend } = useFieldArray({
    control: methods.control,
    name: 'participants',
  })

  const handleAddParticipant = () => {
    participantAppend(`${participantFields.length + 1}`)
  }

  const handleSubmit: SubmitHandler<GameSchema> = (values) => {
    const result = randomizeParticipantIndex(values.participants)
    setOutcomeHistory((history) => {
      return [
        {
          participantName: values.participants[result],
          outcome: values.outcome,
          createdAt: new Date().getTime(),
        },
      ]
        .concat(history)
        .slice(0, 5)
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className={styles.container}>
        <Container>
          <Stack>
            <div className={styles.history}>
              {outcomeHistory.map(({ participantName, outcome, createdAt }, i) => {
                return (
                  <div key={i} title={new Date(createdAt).toLocaleString()}>
                    <Text size="xl" span>
                      <Text fw={700} span>
                        {participantName}
                      </Text>{' '}
                      - {outcome}
                    </Text>
                  </div>
                )
              })}
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
                  fieldName={`participants.${index}`}
                  autoComplete="off"
                  placeholder="이름"
                />
              ))}
              <ActionIcon variant="filled" aria-label="Add" onClick={handleAddParticipant}>
                <IconPlus stroke={1} />
              </ActionIcon>
            </Flex>
            <div className={styles.outcomesWrapper}>
              <Input fieldName="outcome" placeholder="당첨 결과" autoComplete="off" />
            </div>
            <Button variant="filled" type="submit">
              시작
            </Button>
          </Stack>
        </Container>
        <DevTool control={methods.control} />
      </form>
    </FormProvider>
  )
}

export default App
