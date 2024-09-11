import type { MarkOptional } from 'ts-essentials'

import type {
  ClientField,
  NamedTab,
  TabsField,
  TabsFieldClient,
  UnnamedTab,
} from '../../fields/config/types.js'
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

export type ClientTab =
  | ({ fields: ClientField[] } & Omit<NamedTab, 'fields'>)
  | ({ fields: ClientField[] } & Omit<UnnamedTab, 'fields'>)

type TabsFieldClientWithoutType = MarkOptional<TabsFieldClient, 'type'>

export type TabsFieldClientProps = ClientFieldBase<TabsFieldClientWithoutType>

export type TabsFieldServerProps = ServerFieldBase<TabsField>

export type TabsFieldServerComponent = FieldServerComponent<TabsField>

export type TabsFieldClientComponent = FieldClientComponent<TabsFieldClientWithoutType>

export type TabsFieldLabelServerComponent = FieldLabelServerComponent<TabsField>

export type TabsFieldLabelClientComponent = FieldLabelClientComponent<TabsFieldClientWithoutType>

export type TabsFieldDescriptionServerComponent = FieldDescriptionServerComponent<TabsField>

export type TabsFieldDescriptionClientComponent =
  FieldDescriptionClientComponent<TabsFieldClientWithoutType>

export type TabsFieldErrorServerComponent = FieldErrorServerComponent<TabsField>

export type TabsFieldErrorClientComponent = FieldErrorClientComponent<TabsFieldClientWithoutType>
