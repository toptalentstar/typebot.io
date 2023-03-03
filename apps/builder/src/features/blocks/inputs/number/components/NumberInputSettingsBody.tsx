import { TextInput, NumberInput } from '@/components/inputs'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { removeUndefinedFields } from '@/utils/helpers'
import { FormLabel, Stack } from '@chakra-ui/react'
import { NumberInputOptions, Variable } from 'models'
import React from 'react'

type NumberInputSettingsBodyProps = {
  options: NumberInputOptions
  onOptionsChange: (options: NumberInputOptions) => void
}

export const NumberInputSettingsBody = ({
  options,
  onOptionsChange,
}: NumberInputSettingsBodyProps) => {
  const handlePlaceholderChange = (placeholder: string) =>
    onOptionsChange({ ...options, labels: { ...options.labels, placeholder } })
  const handleButtonLabelChange = (button: string) =>
    onOptionsChange({ ...options, labels: { ...options.labels, button } })
  const handleMinChange = (min?: number) =>
    onOptionsChange(removeUndefinedFields({ ...options, min }))
  const handleMaxChange = (max?: number) =>
    onOptionsChange(removeUndefinedFields({ ...options, max }))
  const handleBlockChange = (block?: number) =>
    onOptionsChange(removeUndefinedFields({ ...options, block }))
  const handleVariableChange = (variable?: Variable) => {
    onOptionsChange({ ...options, variableId: variable?.id })
  }

  return (
    <Stack spacing={4}>
      <TextInput
        label="Placeholder:"
        defaultValue={options.labels.placeholder}
        onChange={handlePlaceholderChange}
      />
      <TextInput
        label="Button label:"
        defaultValue={options?.labels?.button ?? 'Send'}
        onChange={handleButtonLabelChange}
      />
      <NumberInput
        label="Min:"
        defaultValue={options.min}
        onValueChange={handleMinChange}
        withVariableButton={false}
      />
      <NumberInput
        label="Max:"
        defaultValue={options.max}
        onValueChange={handleMaxChange}
        withVariableButton={false}
      />
      <NumberInput
        label="Step:"
        defaultValue={options.step}
        onValueChange={handleBlockChange}
        withVariableButton={false}
      />
      <Stack>
        <FormLabel mb="0" htmlFor="variable">
          Save answer in a variable:
        </FormLabel>
        <VariableSearchInput
          initialVariableId={options.variableId}
          onSelectVariable={handleVariableChange}
        />
      </Stack>
    </Stack>
  )
}
