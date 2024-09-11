import type { MarkOptional } from 'ts-essentials'

import type { SelectField, SelectFieldClient } from '../../fields/config/types.js'
import type { SelectFieldValidation } from '../../fields/validations.js'
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

type SelectFieldClientWithoutType = MarkOptional<SelectFieldClient, 'type'>

type SelectFieldBaseClientProps = {
  readonly onChange?: (e: string | string[]) => void
  readonly validate?: SelectFieldValidation
  readonly value?: string
}

export type SelectFieldClientProps = ClientFieldBase<SelectFieldClientWithoutType> &
  SelectFieldBaseClientProps

export type SelectFieldServerProps = ServerFieldBase<SelectField>

export type SelectFieldServerComponent = FieldServerComponent<SelectField>

export type SelectFieldClientComponent = FieldClientComponent<
  SelectFieldClientWithoutType,
  SelectFieldBaseClientProps
>

export type SelectFieldLabelServerComponent = FieldLabelServerComponent<SelectField>

export type SelectFieldLabelClientComponent =
  FieldLabelClientComponent<SelectFieldClientWithoutType>

export type SelectFieldDescriptionServerComponent = FieldDescriptionServerComponent<SelectField>

export type SelectFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<SelectFieldClientWithoutType>

export type SelectFieldErrorServerComponent = FieldErrorServerComponent<SelectField>

export type SelectFieldErrorClientComponent =
  FieldErrorClientComponent<SelectFieldClientWithoutType>
