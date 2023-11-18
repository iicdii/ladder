import { InputHTMLAttributes } from 'react'

import { useController, useFormContext } from 'react-hook-form'

import { TextInput } from '@mantine/core'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
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

  return <TextInput {...field} {...rest} error={error && error.message} />
}

export default Input
