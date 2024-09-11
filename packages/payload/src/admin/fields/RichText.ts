import type { MarkOptional } from 'ts-essentials'

import type { RichTextField, RichTextFieldClient } from '../../fields/config/types.js'
import type { RichTextFieldValidation } from '../../fields/validations.js'
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

type RichTextFieldClientWithoutType = MarkOptional<RichTextFieldClient, 'type'>

type RichTextFieldBaseClientProps<
  TValue extends object = any,
  TAdapterProps = any,
  TExtraProperties = object,
> = {
  readonly validate?: RichTextFieldValidation
}

export type RichTextFieldClientProps<
  TValue extends object = any,
  TAdapterProps = any,
  TExtraProperties = object,
> = ClientFieldBase<RichTextFieldClientWithoutType> &
  RichTextFieldBaseClientProps<TValue, TAdapterProps, TExtraProperties>

export type RichTextFieldServerProps = ServerFieldBase<RichTextField>

export type RichTextFieldServerComponent = FieldServerComponent<RichTextField>

export type RichTextFieldClientComponent = FieldClientComponent<
  RichTextFieldClientWithoutType,
  RichTextFieldBaseClientProps
>

export type RichTextFieldLabelServerComponent = FieldLabelServerComponent<RichTextField>

export type RichTextFieldLabelClientComponent =
  FieldLabelClientComponent<RichTextFieldClientWithoutType>

export type RichTextFieldDescriptionServerComponent = FieldDescriptionServerComponent<RichTextField>

export type RichTextFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<RichTextFieldClientWithoutType>

export type RichTextFieldErrorServerComponent = FieldErrorServerComponent<RichTextField>

export type RichTextFieldErrorClientComponent =
  FieldErrorClientComponent<RichTextFieldClientWithoutType>
