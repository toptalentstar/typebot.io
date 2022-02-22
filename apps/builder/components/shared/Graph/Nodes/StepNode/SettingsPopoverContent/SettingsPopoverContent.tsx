import {
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  useEventListener,
  Portal,
  IconButton,
} from '@chakra-ui/react'
import { ExpandIcon } from 'assets/icons'
import {
  ConditionItem,
  ConditionStep,
  InputStepType,
  IntegrationStepType,
  LogicStepType,
  Step,
  StepOptions,
  TextBubbleStep,
  Webhook,
  WebhookStep,
} from 'models'
import { useRef } from 'react'
import {
  TextInputSettingsBody,
  NumberInputSettingsBody,
  EmailInputSettingsBody,
  UrlInputSettingsBody,
  DateInputSettingsBody,
} from './bodies'
import { ChoiceInputSettingsBody } from './bodies/ChoiceInputSettingsBody'
import { ConditionSettingsBody } from './bodies/ConditionSettingsBody'
import { GoogleAnalyticsSettings } from './bodies/GoogleAnalyticsSettings'
import { GoogleSheetsSettingsBody } from './bodies/GoogleSheetsSettingsBody'
import { PhoneNumberSettingsBody } from './bodies/PhoneNumberSettingsBody'
import { RedirectSettings } from './bodies/RedirectSettings'
import { SendEmailSettings } from './bodies/SendEmailSettings/SendEmailSettings'
import { SetVariableSettings } from './bodies/SetVariableSettings'
import { WebhookSettings } from './bodies/WebhookSettings'
import { ZapierSettings } from './bodies/ZapierSettings'

type Props = {
  step: Exclude<Step, TextBubbleStep>
  webhook?: Webhook
  onExpandClick: () => void
  onStepChange: (updates: Partial<Step>) => void
  onTestRequestClick: () => void
}

export const SettingsPopoverContent = ({ onExpandClick, ...props }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const handleMouseDown = (e: React.MouseEvent) => e.stopPropagation()

  const handleMouseWheel = (e: WheelEvent) => {
    e.stopPropagation()
  }
  useEventListener('wheel', handleMouseWheel, ref.current)
  return (
    <Portal>
      <PopoverContent onMouseDown={handleMouseDown} pos="relative">
        <PopoverArrow />
        <PopoverBody
          pt="10"
          pb="6"
          overflowY="scroll"
          maxH="400px"
          ref={ref}
          shadow="lg"
        >
          <StepSettings {...props} />
        </PopoverBody>
        <IconButton
          pos="absolute"
          top="5px"
          right="5px"
          aria-label="expand"
          icon={<ExpandIcon />}
          size="xs"
          onClick={onExpandClick}
        />
      </PopoverContent>
    </Portal>
  )
}

export const StepSettings = ({
  step,
  onStepChange,
  onTestRequestClick,
}: {
  step: Step
  webhook?: Webhook
  onStepChange: (step: Partial<Step>) => void
  onTestRequestClick: () => void
}) => {
  const handleOptionsChange = (options: StepOptions) => {
    onStepChange({ options } as Partial<Step>)
  }
  const handleWebhookChange = (updates: Partial<Webhook>) => {
    onStepChange({
      webhook: { ...(step as WebhookStep).webhook, ...updates },
    } as Partial<Step>)
  }
  const handleItemChange = (updates: Partial<ConditionItem>) => {
    onStepChange({
      items: [{ ...(step as ConditionStep).items[0], ...updates }],
    } as Partial<Step>)
  }
  switch (step.type) {
    case InputStepType.TEXT: {
      return (
        <TextInputSettingsBody
          options={step.options}
          onOptionsChange={handleOptionsChange}
        />
      )
    }
    case InputStepType.NUMBER: {
      return (
        <NumberInputSettingsBody
          options={step.options}
          onOptionsChange={handleOptionsChange}
        />
      )
    }
    case InputStepType.EMAIL: {
      return (
        <EmailInputSettingsBody
          options={step.options}
          onOptionsChange={handleOptionsChange}
        />
      )
    }
    case InputStepType.URL: {
      return (
        <UrlInputSettingsBody
          options={step.options}
          onOptionsChange={handleOptionsChange}
        />
      )
    }
    case InputStepType.DATE: {
      return (
        <DateInputSettingsBody
          options={step.options}
          onOptionsChange={handleOptionsChange}
        />
      )
    }
    case InputStepType.PHONE: {
      return (
        <PhoneNumberSettingsBody
          options={step.options}
          onOptionsChange={handleOptionsChange}
        />
      )
    }
    case InputStepType.CHOICE: {
      return (
        <ChoiceInputSettingsBody
          options={step.options}
          onOptionsChange={handleOptionsChange}
        />
      )
    }
    case LogicStepType.SET_VARIABLE: {
      return (
        <SetVariableSettings
          options={step.options}
          onOptionsChange={handleOptionsChange}
        />
      )
    }
    case LogicStepType.CONDITION: {
      return (
        <ConditionSettingsBody step={step} onItemChange={handleItemChange} />
      )
    }
    case LogicStepType.REDIRECT: {
      return (
        <RedirectSettings
          options={step.options}
          onOptionsChange={handleOptionsChange}
        />
      )
    }
    case IntegrationStepType.GOOGLE_SHEETS: {
      return (
        <GoogleSheetsSettingsBody
          options={step.options}
          onOptionsChange={handleOptionsChange}
          stepId={step.id}
        />
      )
    }
    case IntegrationStepType.GOOGLE_ANALYTICS: {
      return (
        <GoogleAnalyticsSettings
          options={step.options}
          onOptionsChange={handleOptionsChange}
        />
      )
    }
    case IntegrationStepType.ZAPIER: {
      return <ZapierSettings step={step} />
    }
    case IntegrationStepType.WEBHOOK: {
      return (
        <WebhookSettings
          step={step}
          onOptionsChange={handleOptionsChange}
          onWebhookChange={handleWebhookChange}
          onTestRequestClick={onTestRequestClick}
        />
      )
    }
    case IntegrationStepType.EMAIL: {
      return (
        <SendEmailSettings
          options={step.options}
          onOptionsChange={handleOptionsChange}
        />
      )
    }
    default: {
      return <></>
    }
  }
}
