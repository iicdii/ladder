import { useController, useFormContext } from 'react-hook-form'

import { TextInput, TextInputProps } from '@mantine/core'

interface InputProps extends TextInputProps {
  fieldName: string
}

const Input = ({ fieldName, size: _, ...rest }: InputProps) => {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { error },
  } = useController({
    name: fieldName,
    control,
  })

  console.log('error', error)

  return <TextInput {...field} {...rest} error={error && error.message} />
}

export default Input
