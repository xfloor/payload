import type { MarkOptional } from 'ts-essentials'

import type { RadioField, RadioFieldClient } from '../../fields/config/types.js'
import type { RadioFieldValidation } from '../../fields/validations.js'
import type { FieldErrorClientComponent, FieldErrorServerComponent } from '../forms/Error.js'
import type {
  ClientFieldBase,
  FieldClientComponent,
  FieldServerComponent,
  ServerFieldBase,
} from '../forms/Field.js'
import type {
  FieldDescriptionClientComponent,
  FieldDescriptionServerComponent,
  FieldLabelClientComponent,
  FieldLabelServerComponent,
} from '../types.js'

type RadioFieldClientWithoutType = MarkOptional<RadioFieldClient, 'type'>

type RadioFieldBaseClientProps = {
  readonly onChange?: OnChange
  readonly validate?: RadioFieldValidation
  readonly value?: string
}

export type RadioFieldClientProps = ClientFieldBase<RadioFieldClientWithoutType> &
  RadioFieldBaseClientProps

export type RadioFieldServerProps = ServerFieldBase<RadioField>

export type RadioFieldServerComponent = FieldServerComponent<RadioField>

export type RadioFieldClientComponent = FieldClientComponent<
  RadioFieldClientWithoutType,
  RadioFieldBaseClientProps
>

export type OnChange<T = string> = (value: T) => void

export type RadioFieldLabelServerComponent = FieldLabelServerComponent<RadioField>

export type RadioFieldLabelClientComponent = FieldLabelClientComponent<RadioFieldClientWithoutType>

export type RadioFieldDescriptionServerComponent = FieldDescriptionServerComponent<RadioField>

export type RadioFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<RadioFieldClientWithoutType>

export type RadioFieldErrorServerComponent = FieldErrorServerComponent<RadioField>

export type RadioFieldErrorClientComponent = FieldErrorClientComponent<RadioFieldClientWithoutType>
