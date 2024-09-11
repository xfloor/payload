/* eslint-disable @typescript-eslint/no-explicit-any */

import type { EditorProps } from '@monaco-editor/react'
import type { JSONSchema4 } from 'json-schema'
import type { CSSProperties } from 'react'
import type { DeepUndefinable } from 'ts-essentials'

import type { FieldClientComponent, FieldServerComponent } from '../../admin/forms/Field.js'
import type { RichTextAdapter, RichTextAdapterProvider } from '../../admin/RichText.js'
import type {
  ArrayFieldClientProps,
  ArrayFieldErrorClientComponent,
  ArrayFieldErrorServerComponent,
  ArrayFieldLabelClientComponent,
  ArrayFieldLabelServerComponent,
  BlocksFieldClientProps,
  BlocksFieldErrorClientComponent,
  BlocksFieldErrorServerComponent,
  CheckboxFieldClientProps,
  CheckboxFieldErrorClientComponent,
  CheckboxFieldErrorServerComponent,
  CheckboxFieldLabelClientComponent,
  CheckboxFieldLabelServerComponent,
  ClientTab,
  CodeFieldClientProps,
  CodeFieldErrorClientComponent,
  CodeFieldErrorServerComponent,
  CodeFieldLabelClientComponent,
  CodeFieldLabelServerComponent,
  CollapsibleFieldClientProps,
  CollapsibleFieldLabelClientComponent,
  CollapsibleFieldLabelServerComponent,
  ConditionalDateProps,
  DateFieldClientProps,
  DateFieldErrorClientComponent,
  DateFieldErrorServerComponent,
  DateFieldLabelClientComponent,
  DateFieldLabelServerComponent,
  Description,
  EmailFieldClientProps,
  EmailFieldErrorClientComponent,
  EmailFieldErrorServerComponent,
  EmailFieldLabelClientComponent,
  EmailFieldLabelServerComponent,
  FieldDescriptionClientComponent,
  FieldDescriptionServerComponent,
  GroupFieldClientProps,
  GroupFieldLabelClientComponent,
  GroupFieldLabelServerComponent,
  HiddenFieldProps,
  JSONFieldClientProps,
  JSONFieldErrorClientComponent,
  JSONFieldErrorServerComponent,
  JSONFieldLabelClientComponent,
  JSONFieldLabelServerComponent,
  MappedComponent,
  NumberFieldClientProps,
  NumberFieldErrorClientComponent,
  NumberFieldErrorServerComponent,
  NumberFieldLabelClientComponent,
  NumberFieldLabelServerComponent,
  PointFieldClientProps,
  PointFieldErrorClientComponent,
  PointFieldErrorServerComponent,
  PointFieldLabelClientComponent,
  PointFieldLabelServerComponent,
  RadioFieldClientProps,
  RadioFieldErrorClientComponent,
  RadioFieldErrorServerComponent,
  RadioFieldLabelClientComponent,
  RadioFieldLabelServerComponent,
  RelationshipFieldClientProps,
  RelationshipFieldErrorClientComponent,
  RelationshipFieldErrorServerComponent,
  RelationshipFieldLabelClientComponent,
  RelationshipFieldLabelServerComponent,
  RichTextFieldClientProps,
  RowFieldClientProps,
  RowLabelComponent,
  SelectFieldClientProps,
  SelectFieldErrorClientComponent,
  SelectFieldErrorServerComponent,
  SelectFieldLabelClientComponent,
  SelectFieldLabelServerComponent,
  StaticDescription,
  TabsFieldClientProps,
  TextareaFieldClientProps,
  TextareaFieldErrorClientComponent,
  TextareaFieldErrorServerComponent,
  TextareaFieldLabelClientComponent,
  TextareaFieldLabelServerComponent,
  TextFieldErrorClientComponent,
  TextFieldErrorServerComponent,
  TextFieldLabelClientComponent,
  TextFieldLabelServerComponent,
  UploadFieldClientProps,
} from '../../admin/types.js'
import type { SanitizedCollectionConfig, TypeWithID } from '../../collections/config/types.js'
import type {
  CustomComponent,
  LabelFunction,
  PayloadComponent,
  StaticLabel,
} from '../../config/types.js'
import type { DBIdentifierName } from '../../database/types.js'
import type { SanitizedGlobalConfig } from '../../globals/config/types.js'
import type { CollectionSlug } from '../../index.js'
import type { DocumentPreferences } from '../../preferences/types.js'
import type { Operation, PayloadRequest, RequestContext, Where } from '../../types/index.js'

export type FieldHookArgs<TData extends TypeWithID = any, TValue = any, TSiblingData = any> = {
  /** The collection which the field belongs to. If the field belongs to a global, this will be null. */
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  /**
   * Only available in `afterRead` hooks
   */
  currentDepth?: number /**
   * Only available in `afterRead` hooks
   */
  /** The data passed to update the document within create and update operations, and the full document itself in the afterRead hook. */
  data?: Partial<TData>
  /**
   * Only available in the `afterRead` hook.
   */
  depth?: number
  draft?: boolean
  /** The field which the hook is running against. */
  field: FieldAffectingData
  /** Boolean to denote if this hook is running against finding one, or finding many within the afterRead hook. */
  findMany?: boolean
  /** The global which the field belongs to. If the field belongs to a collection, this will be null. */
  global: null | SanitizedGlobalConfig
  /** A string relating to which operation the field type is currently executing within. Useful within beforeValidate, beforeChange, and afterChange hooks to differentiate between create and update operations. */
  operation?: 'create' | 'delete' | 'read' | 'update'
  /** The full original document in `update` operations. In the `afterChange` hook, this is the resulting document of the operation. */
  originalDoc?: TData
  overrideAccess?: boolean
  /**
   * The path of the field, e.g. ["group", "myArray", 1, "textField"]. The path is the schemaPath but with indexes and would be used in the context of field data, not field schemas.
   */
  path: (number | string)[]
  /** The document before changes were applied, only in `afterChange` hooks. */
  previousDoc?: TData
  /** The sibling data of the document before changes being applied, only in `beforeChange`, `beforeValidate`, `beforeDuplicate` and `afterChange` field hooks. */
  previousSiblingDoc?: TData
  /** The previous value of the field, before changes, only in `beforeChange`, `afterChange`, `beforeDuplicate` and `beforeValidate` field hooks. */
  previousValue?: TValue
  /** The Express request object. It is mocked for Local API operations. */
  req: PayloadRequest
  /**
   * The schemaPath of the field, e.g. ["group", "myArray", "textField"]. The schemaPath is the path but without indexes and would be used in the context of field schemas, not field data.
   */
  schemaPath: string[]
  /**
   * Only available in the `afterRead` hook.
   */
  showHiddenFields?: boolean
  /** The sibling data passed to a field that the hook is running against. */
  siblingData: Partial<TSiblingData>
  /**
   * The original siblingData with locales (not modified by any hooks). Only available in `beforeChange` and `beforeDuplicate` field hooks.
   */
  siblingDocWithLocales?: Record<string, unknown>
  /** The value of the field. */
  value?: TValue
}

export type FieldHook<TData extends TypeWithID = any, TValue = any, TSiblingData = any> = (
  args: FieldHookArgs<TData, TValue, TSiblingData>,
) => Promise<TValue> | TValue

export type FieldAccess<TData extends TypeWithID = any, TSiblingData = any> = (args: {
  /**
   * The incoming data used to `create` or `update` the document with. `data` is undefined during the `read` operation.
   */
  data?: Partial<TData>
  /**
   * The original data of the document before the `update` is applied. `doc` is undefined during the `create` operation.
   */
  doc?: TData
  /**
   * The `id` of the current document being read or updated. `id` is undefined during the `create` operation.
   */
  id?: number | string
  /** The `payload` object to interface with the payload API */
  req: PayloadRequest
  /**
   * Immediately adjacent data to this field. For example, if this is a `group` field, then `siblingData` will be the other fields within the group.
   */
  siblingData?: Partial<TSiblingData>
}) => boolean | Promise<boolean>

export type Condition<TData extends TypeWithID = any, TSiblingData = any> = (
  data: Partial<TData>,
  siblingData: Partial<TSiblingData>,
  { user }: { user: PayloadRequest['user'] },
) => boolean

export type FilterOptionsProps<TData = any> = {
  /**
   * An object containing the full collection or global document currently being edited.
   */
  data: TData
  /**
   * The `id` of the current document being edited. `id` is undefined during the `create` operation.
   */
  id: number | string
  /**
   * The collection `slug` to filter against, limited to this field's `relationTo` property.
   */
  relationTo: CollectionSlug
  /**
   * An object containing document data that is scoped to only fields within the same parent of this field.
   */
  siblingData: unknown
  /**
   * An object containing the currently authenticated user.
   */
  user: Partial<PayloadRequest['user']>
}

export type FilterOptionsFunc<TData = any> = (
  options: FilterOptionsProps<TData>,
) => boolean | Promise<boolean | Where> | Where

export type FilterOptions<TData = any> =
  | ((options: FilterOptionsProps<TData>) => boolean | Promise<boolean | Where> | Where)
  | null
  | Where

type Admin = {
  className?: string
  components?: {
    Cell?: CustomComponent
    Description?: CustomComponent<FieldDescriptionClientComponent | FieldDescriptionServerComponent>
    Field?: CustomComponent<FieldClientComponent | FieldServerComponent>
    /**
     * The Filter component has to be a client component
     */
    Filter?: PayloadComponent
  }
  /**
   * You can programmatically show / hide fields based on what other fields are doing.
   * This is also run on the server, to determine if the field should be validated.
   */
  condition?: Condition
  /** Extension point to add your custom data. Available in server and client. */
  custom?: Record<string, any>
  description?: Description
  disableBulkEdit?: boolean
  disabled?: boolean
  /**
   * Shows / hides fields from appearing in the list view column selector.
   * @type boolean
   */
  disableListColumn?: boolean
  /**
   * Shows / hides fields from appearing in the list view filter options.
   * @type boolean
   */
  disableListFilter?: boolean
  hidden?: boolean
  position?: 'sidebar'
  readOnly?: boolean
  style?: CSSProperties
  width?: CSSProperties['width']
}

export type AdminClient = {
  className?: string
  components?: {
    Cell?: MappedComponent
    Description?: MappedComponent
    Field?: MappedComponent
    /**
     * The Filter component has to be a client component
     */
    Filter?: MappedComponent
  }
  /** Extension point to add your custom data. Available in server and client. */
  custom?: Record<string, any>
  description?: StaticDescription
  disableBulkEdit?: boolean
  disabled?: boolean
  /**
   * Shows / hides fields from appearing in the list view column selector.
   * @type boolean
   */
  disableListColumn?: boolean
  /**
   * Shows / hides fields from appearing in the list view filter options.
   * @type boolean
   */
  disableListFilter?: boolean
  hidden?: boolean
  position?: 'sidebar'
  readOnly?: boolean
  style?: { '--field-width'?: CSSProperties['width'] } & CSSProperties
  width?: CSSProperties['width']
}

export type Labels = {
  plural: LabelFunction | StaticLabel
  singular: LabelFunction | StaticLabel
}

export type LabelsClient = {
  plural: StaticLabel
  singular: StaticLabel
}

export type BaseValidateOptions<TData, TSiblingData, TValue> = {
  collectionSlug?: string
  data: Partial<TData>
  id?: number | string
  operation?: Operation
  preferences: DocumentPreferences
  previousValue?: TValue
  req: PayloadRequest
  required?: boolean
  siblingData: Partial<TSiblingData>
}

export type ValidateOptions<
  TData,
  TSiblingData,
  TFieldConfig extends object,
  TValue,
> = BaseValidateOptions<TData, TSiblingData, TValue> & TFieldConfig

export type Validate<
  TValue = any,
  TData = any,
  TSiblingData = any,
  TFieldConfig extends object = object,
> = (
  value: TValue,
  options: ValidateOptions<TData, TSiblingData, TFieldConfig, TValue>,
) => Promise<string | true> | string | true

export type OptionObject = {
  label: LabelFunction | StaticLabel
  value: string
}

export type Option = OptionObject | string

export interface FieldBase {
  /**
   * Do not set this property manually. This is set to true during sanitization, to avoid
   * sanitizing the same field multiple times.
   */
  _sanitized?: boolean
  access?: {
    create?: FieldAccess
    read?: FieldAccess
    update?: FieldAccess
  }
  admin?: Admin
  /** Extension point to add your custom data. Server only. */
  custom?: Record<string, any>
  defaultValue?: any
  hidden?: boolean
  hooks?: {
    afterChange?: FieldHook[]
    afterRead?: FieldHook[]
    beforeChange?: FieldHook[]
    /**
     * Runs before a document is duplicated to prevent errors in unique fields or return null to use defaultValue.
     */
    beforeDuplicate?: FieldHook[]
    beforeValidate?: FieldHook[]
  }
  index?: boolean
  label?: false | LabelFunction | StaticLabel
  localized?: boolean
  /**
   * The name of the field. Must be alphanumeric and cannot contain ' . '
   *
   * Must not be one of reserved field names: ['__v', 'salt', 'hash', 'file']
   * @link https://payloadcms.com/docs/fields/overview#field-names
   */
  name: string
  required?: boolean
  saveToJWT?: boolean | string
  /**
   * Allows you to modify the base JSON schema that is generated during generate:types for this field.
   * This JSON schema will be used to generate the TypeScript interface of this field.
   */
  typescriptSchema?: Array<(args: { jsonSchema: JSONSchema4 }) => JSONSchema4>
  unique?: boolean
  validate?: Validate
}

export interface FieldBaseClient {
  _isPresentational?: undefined
  _path?: string
  _schemaPath?: string
  admin?: AdminClient
  hidden?: boolean
  index?: boolean
  label?: StaticLabel
  localized?: boolean
  /**
   * The name of the field. Must be alphanumeric and cannot contain ' . '
   *
   * Must not be one of reserved field names: ['__v', 'salt', 'hash', 'file']
   * @link https://payloadcms.com/docs/fields/overview#field-names
   */
  name?: string
  required?: boolean
  saveToJWT?: boolean | string
  /**
   * Allows you to modify the base JSON schema that is generated during generate:types for this field.
   * This JSON schema will be used to generate the TypeScript interface of this field.
   */
  typescriptSchema?: Array<(args: { jsonSchema: JSONSchema4 }) => JSONSchema4>
  unique?: boolean
}

export type NumberField = {
  admin?: {
    /** Set this property to a string that will be used for browser autocomplete. */
    autoComplete?: string
    components?: {
      afterInput?: CustomComponent[]
      beforeInput?: CustomComponent[]
      Error?: CustomComponent<NumberFieldErrorClientComponent | NumberFieldErrorServerComponent>
      Label?: CustomComponent<NumberFieldLabelClientComponent | NumberFieldLabelServerComponent>
    } & Admin['components']
    /** Set this property to define a placeholder string for the field. */
    placeholder?: Record<string, string> | string
    /** Set a value for the number field to increment / decrement using browser controls. */
    step?: number
  } & Admin
  /** Maximum value accepted. Used in the default `validate` function. */
  max?: number
  /** Minimum value accepted. Used in the default `validate` function. */
  min?: number
  type: 'number'
  validate?: Validate<number | number[], unknown, unknown, NumberField>
} & (
  | {
      /** Makes this field an ordered array of numbers instead of just a single number. */
      hasMany: true
      /** Maximum number of numbers in the numbers array, if `hasMany` is set to true. */
      maxRows?: number
      /** Minimum number of numbers in the numbers array, if `hasMany` is set to true. */
      minRows?: number
    }
  | {
      /** Makes this field an ordered array of numbers instead of just a single number. */
      hasMany?: false | undefined
      /** Maximum number of numbers in the numbers array, if `hasMany` is set to true. */
      maxRows?: undefined
      /** Minimum number of numbers in the numbers array, if `hasMany` is set to true. */
      minRows?: undefined
    }
) &
  FieldBase

export type NumberFieldClient = {
  admin?: {
    components?: {
      afterInput?: MappedComponent[]
      beforeInput?: MappedComponent[]
      Error?: MappedComponent
      Label?: MappedComponent
    } & AdminClient['components']
  } & AdminClient &
    Pick<NumberField['admin'], 'autoComplete' | 'placeholder' | 'step'>
} & FieldBaseClient &
  Pick<NumberField, 'hasMany' | 'max' | 'maxRows' | 'min' | 'minRows' | 'type'>

export type TextField = {
  admin?: {
    autoComplete?: string
    components?: {
      afterInput?: CustomComponent[]
      beforeInput?: CustomComponent[]
      Error?: CustomComponent<TextFieldErrorClientComponent | TextFieldErrorServerComponent>
      Label?: CustomComponent<TextFieldLabelClientComponent | TextFieldLabelServerComponent>
    } & Admin['components']
    placeholder?: Record<string, string> | string
    rtl?: boolean
  } & Admin
  maxLength?: number
  minLength?: number
  type: 'text'
  validate?: Validate<string | string[], unknown, unknown, TextField>
} & (
  | {
      /** Makes this field an ordered array of strings instead of just a single string. */
      hasMany: true
      /** Maximum number of strings in the strings array, if `hasMany` is set to true. */
      maxRows?: number
      /** Minimum number of strings in the strings array, if `hasMany` is set to true. */
      minRows?: number
    }
  | {
      /** Makes this field an ordered array of strings instead of just a single string. */
      hasMany?: false | undefined
      /** Maximum number of strings in the strings array, if `hasMany` is set to true. */
      maxRows?: undefined
      /** Minimum number of strings in the strings array, if `hasMany` is set to true. */
      minRows?: undefined
    }
) &
  FieldBase

export type TextFieldClient = {
  admin?: {
    components?: {
      afterInput?: MappedComponent[]
      beforeInput?: MappedComponent[]
      Error?: MappedComponent
      Label?: MappedComponent
    } & AdminClient['components']
  } & AdminClient &
    Pick<TextField['admin'], 'autoComplete' | 'placeholder' | 'rtl'>
} & FieldBaseClient &
  Pick<TextField, 'hasMany' | 'maxLength' | 'maxRows' | 'minLength' | 'minRows' | 'type'>

export type EmailField = {
  admin?: {
    autoComplete?: string
    components?: {
      afterInput?: CustomComponent[]
      beforeInput?: CustomComponent[]
      Error?: CustomComponent<EmailFieldErrorClientComponent | EmailFieldErrorServerComponent>
      Label?: CustomComponent<EmailFieldLabelClientComponent | EmailFieldLabelServerComponent>
    } & Admin['components']
    placeholder?: Record<string, string> | string
  } & Admin
  type: 'email'
  validate?: Validate<string, unknown, unknown, EmailField>
} & FieldBase

export type EmailFieldClient = {
  admin?: {
    components?: {
      afterInput?: MappedComponent[]
      beforeInput?: MappedComponent[]
      Error?: MappedComponent
      Label?: MappedComponent
    } & AdminClient['components']
  } & AdminClient &
    Pick<EmailField['admin'], 'placeholder'>
} & FieldBaseClient &
  Pick<EmailField, 'type'>

export type TextareaField = {
  admin?: {
    components?: {
      afterInput?: CustomComponent[]
      beforeInput?: CustomComponent[]
      Error?: CustomComponent<TextareaFieldErrorClientComponent | TextareaFieldErrorServerComponent>
      Label?: CustomComponent<TextareaFieldLabelClientComponent | TextareaFieldLabelServerComponent>
    } & Admin['components']
    placeholder?: Record<string, string> | string
    rows?: number
    rtl?: boolean
  } & Admin
  maxLength?: number
  minLength?: number
  type: 'textarea'
  validate?: Validate<string, unknown, unknown, TextareaField>
} & FieldBase

export type TextareaFieldClient = {
  admin?: {
    components?: {
      afterInput?: MappedComponent[]
      beforeInput?: MappedComponent[]
      Error?: MappedComponent
      Label?: MappedComponent
    } & AdminClient['components']
  } & AdminClient &
    Pick<TextareaField['admin'], 'placeholder' | 'rows' | 'rtl'>
} & FieldBaseClient &
  Pick<TextareaField, 'maxLength' | 'minLength' | 'type'>

export type CheckboxField = {
  admin?: {
    components?: {
      afterInput?: CustomComponent[]
      beforeInput?: CustomComponent[]
      Error?: CustomComponent<CheckboxFieldErrorClientComponent | CheckboxFieldErrorServerComponent>
      Label?: CustomComponent<CheckboxFieldLabelClientComponent | CheckboxFieldLabelServerComponent>
    } & Admin['components']
  } & Admin
  type: 'checkbox'
  validate?: Validate<unknown, unknown, unknown, CheckboxField>
} & FieldBase

export type CheckboxFieldClient = {
  admin?: {
    components?: {
      afterInput?: MappedComponent[]
      beforeInput?: MappedComponent[]
      Error?: MappedComponent
      Label?: MappedComponent
    } & AdminClient['components']
  } & AdminClient
} & FieldBaseClient &
  Pick<CheckboxField, 'type'>

export type DateField = {
  admin?: {
    components?: {
      afterInput?: CustomComponent[]
      beforeInput?: CustomComponent[]
      Error?: CustomComponent<DateFieldErrorClientComponent | DateFieldErrorServerComponent>
      Label?: CustomComponent<DateFieldLabelClientComponent | DateFieldLabelServerComponent>
    } & Admin['components']
    date?: ConditionalDateProps
    placeholder?: Record<string, string> | string
  } & Admin
  type: 'date'
  validate?: Validate<unknown, unknown, unknown, DateField>
} & FieldBase

export type DateFieldClient = {
  admin?: {
    components?: {
      afterInput?: MappedComponent[]
      beforeInput?: MappedComponent[]
      Error?: MappedComponent
      Label?: MappedComponent
    } & AdminClient['components']
  } & AdminClient &
    Pick<DateField['admin'], 'date' | 'placeholder'>
} & FieldBaseClient &
  Pick<DateField, 'type'>

export type GroupField = {
  admin?: {
    components?: {
      Label?: CustomComponent<GroupFieldLabelClientComponent | GroupFieldLabelServerComponent>
    } & Admin['components']
    hideGutter?: boolean
  } & Admin
  fields: Field[]
  /** Customize generated GraphQL and Typescript schema names.
   * By default, it is bound to the collection.
   *
   * This is useful if you would like to generate a top level type to share amongst collections/fields.
   * **Note**: Top level types can collide, ensure they are unique amongst collections, arrays, groups, blocks, tabs.
   */
  interfaceName?: string
  type: 'group'
  validate?: Validate<unknown, unknown, unknown, GroupField>
} & Omit<FieldBase, 'required'>

export type GroupFieldClient = {
  admin?: {
    components?: {
      Label?: MappedComponent
    } & AdminClient['components']
  } & AdminClient &
    Pick<GroupField['admin'], 'hideGutter'>
  fields: ClientField[]
} & Omit<FieldBaseClient, 'required'> &
  Pick<GroupField, 'interfaceName' | 'type'>

export type RowField = {
  admin?: Omit<Admin, 'description'>
  fields: Field[]
  type: 'row'
} & Omit<FieldBase, 'admin' | 'label' | 'name' | 'validate'>

export type RowFieldClient = {
  admin?: Omit<AdminClient, 'description'>
  fields: ClientField[]
} & Omit<FieldBaseClient, 'admin' | 'label' | 'name' | 'validate'> &
  Pick<RowField, 'type'>

export type CollapsibleField = {
  fields: Field[]
  type: 'collapsible'
} & (
  | {
      admin: {
        components: {
          Label?: CustomComponent<
            CollapsibleFieldLabelClientComponent | CollapsibleFieldLabelServerComponent
          >
          RowLabel: RowLabelComponent
        } & Admin['components']
        initCollapsed?: boolean
      } & Admin
      label?: Required<FieldBase['label']>
    }
  | {
      admin?: {
        components?: {
          Label?: CustomComponent<
            CollapsibleFieldLabelClientComponent | CollapsibleFieldLabelServerComponent
          >
        } & Admin['components']
        initCollapsed?: boolean
      } & Admin
      label: Required<FieldBase['label']>
    }
) &
  Omit<FieldBase, 'label' | 'name' | 'validate'>

export type CollapsibleFieldClient = {
  fields: ClientField[]
} & (
  | {
      admin: {
        components: {
          RowLabel: MappedComponent
        } & AdminClient['components']
        initCollapsed?: boolean
      } & AdminClient
      label?: Required<FieldBaseClient['label']>
    }
  | {
      admin?: {
        initCollapsed?: boolean
      } & AdminClient
      label: Required<FieldBaseClient['label']>
    }
) &
  Omit<FieldBaseClient, 'label' | 'name' | 'validate'> &
  Pick<CollapsibleField, 'type'>

type TabBase = {
  description?: Description
  fields: Field[]
  interfaceName?: string
  saveToJWT?: boolean | string
} & Omit<FieldBase, 'required' | 'validate'>

export type NamedTab = {
  /** Customize generated GraphQL and Typescript schema names.
   * The slug is used by default.
   *
   * This is useful if you would like to generate a top level type to share amongst collections/fields.
   * **Note**: Top level types can collide, ensure they are unique amongst collections, arrays, groups, blocks, tabs.
   */
  interfaceName?: string
} & TabBase

export type UnnamedTab = {
  interfaceName?: never
  /**
   * Can be either:
   * - A string, which will be used as the tab's label.
   * - An object, where the key is the language code and the value is the label.
   */
  label:
    | {
        [selectedLanguage: string]: string
      }
    | LabelFunction
    | string
  localized?: never
} & Omit<TabBase, 'name'>

export type Tab = NamedTab | UnnamedTab

export type TabsField = {
  admin?: Omit<Admin, 'description'>
  tabs: Tab[]
  type: 'tabs'
} & Omit<FieldBase, 'admin' | 'localized' | 'name' | 'saveToJWT'>

export type TabsFieldClient = {
  admin?: Omit<AdminClient, 'description'>
  tabs: ClientTab[]
} & Omit<FieldBaseClient, 'admin' | 'localized' | 'name' | 'saveToJWT'> &
  Pick<TabsField, 'type'>

export type TabAsField = {
  name?: string
  type: 'tab'
} & Tab

export type TabAsFieldClient = ClientTab & Pick<TabAsField, 'name' | 'type'>

export type UIField = {
  admin: {
    components?: {
      Cell?: CustomComponent
      Field: CustomComponent
      /**
       * The Filter component has to be a client component
       */
      Filter?: PayloadComponent
    } & Admin['components']
    condition?: Condition
    /** Extension point to add your custom data. Available in server and client. */
    custom?: Record<string, any>
    disableBulkEdit?: boolean
    /**
     * Shows / hides fields from appearing in the list view column selector.
     * @type boolean
     */
    disableListColumn?: boolean
    position?: string
    width?: CSSProperties['width']
  }
  /** Extension point to add your custom data. Server only. */
  custom?: Record<string, any>
  label?: Record<string, string> | string
  name: string
  type: 'ui'
}

export type UIFieldClient = {
  _isPresentational?: true
  // still include FieldBaseClient.admin (even if it's undefinable) so that we don't need constant type checks (e.g. if('xy' in field))
  // eslint-disable-next-line perfectionist/sort-intersection-types
  admin: DeepUndefinable<FieldBaseClient['admin']> & {
    components?: {
      Cell?: MappedComponent
      Field: MappedComponent
      Filter?: MappedComponent
    } & AdminClient['components']
  } & Pick<
      UIField['admin'],
      'custom' | 'disableBulkEdit' | 'disableListColumn' | 'position' | 'width'
    >
} & Omit<DeepUndefinable<FieldBaseClient>, '_isPresentational' | 'admin'> & // still include FieldBaseClient (even if it's undefinable) so that we don't need constant type checks (e.g. if('xy' in field))
  Pick<UIField, 'label' | 'name' | 'type'>

type SharedUploadProperties = {
  /**
   * Toggle the preview in the admin interface.
   */
  displayPreview?: boolean
  filterOptions?: FilterOptions
  hasMany?: boolean
  /**
   * Sets a maximum population depth for this field, regardless of the remaining depth when this field is reached.
   *
   * {@link https://payloadcms.com/docs/getting-started/concepts#field-level-max-depth}
   */
  maxDepth?: number
  type: 'upload'
  validate?: Validate<unknown, unknown, unknown, SharedUploadProperties>
} & (
  | {
      hasMany: true
      /**
       * @deprecated Use 'maxRows' instead
       */
      max?: number
      maxRows?: number
      /**
       * @deprecated Use 'minRows' instead
       */
      min?: number
      minRows?: number
    }
  | {
      hasMany?: false | undefined
      /**
       * @deprecated Use 'maxRows' instead
       */
      max?: undefined
      maxRows?: undefined
      /**
       * @deprecated Use 'minRows' instead
       */
      min?: undefined
      minRows?: undefined
    }
) &
  FieldBase

type SharedUploadPropertiesClient = FieldBaseClient &
  Pick<
    SharedUploadProperties,
    'hasMany' | 'max' | 'maxDepth' | 'maxRows' | 'min' | 'minRows' | 'type'
  >

type UploadAdmin = {
  allowCreate?: boolean
  components?: {
    Error?: CustomComponent<
      RelationshipFieldErrorClientComponent | RelationshipFieldErrorServerComponent
    >
    Label?: CustomComponent<
      RelationshipFieldLabelClientComponent | RelationshipFieldLabelServerComponent
    >
  } & Admin['components']
  isSortable?: boolean
} & Admin
type UploadAdminClient = {
  components?: {
    Error?: MappedComponent
    Label?: MappedComponent
  } & AdminClient['components']
} & AdminClient &
  Pick<UploadAdmin, 'allowCreate' | 'isSortable'>

export type PolymorphicUploadField = {
  admin?: {
    sortOptions?: { [collectionSlug: CollectionSlug]: string }
  } & UploadAdmin
  relationTo: CollectionSlug[]
} & SharedUploadProperties

export type PolymorphicUploadFieldClient = {
  admin?: {
    sortOptions?: Pick<PolymorphicUploadField['admin'], 'sortOptions'>
  } & UploadAdminClient
} & Pick<PolymorphicUploadField, 'displayPreview' | 'maxDepth' | 'relationTo' | 'type'> &
  SharedUploadPropertiesClient

export type SingleUploadField = {
  admin?: {
    sortOptions?: string
  } & UploadAdmin
  relationTo: CollectionSlug
} & SharedUploadProperties

export type SingleUploadFieldClient = {
  admin?: Pick<SingleUploadField['admin'], 'sortOptions'> & UploadAdminClient
} & Pick<SingleUploadField, 'displayPreview' | 'maxDepth' | 'relationTo' | 'type'> &
  SharedUploadPropertiesClient

export type UploadField = /* PolymorphicUploadField | */ SingleUploadField

export type UploadFieldClient = /* PolymorphicUploadFieldClient | */ SingleUploadFieldClient

export type CodeField = {
  admin?: {
    components?: {
      afterInput?: CustomComponent[]
      beforeInput?: CustomComponent[]
      Error?: CustomComponent<CodeFieldErrorClientComponent | CodeFieldErrorServerComponent>
      Label?: CustomComponent<CodeFieldLabelClientComponent | CodeFieldLabelServerComponent>
    } & Admin['components']
    editorOptions?: EditorProps['options']
    language?: string
  } & Admin
  maxLength?: number
  minLength?: number
  type: 'code'
  validate?: Validate<string, unknown, unknown, CodeField>
} & Omit<FieldBase, 'admin'>

export type CodeFieldClient = {
  admin?: {
    components?: {
      afterInput?: MappedComponent[]
      beforeInput?: MappedComponent[]
      Error?: MappedComponent
      Label?: MappedComponent
    } & AdminClient['components']
  } & AdminClient &
    Pick<CodeField['admin'], 'editorOptions' | 'language'>
} & Omit<FieldBaseClient, 'admin'> &
  Pick<CodeField, 'maxLength' | 'minLength' | 'type'>

export type JSONField = {
  admin?: {
    components?: {
      afterInput?: CustomComponent[]
      beforeInput?: CustomComponent[]
      Error?: CustomComponent<JSONFieldErrorClientComponent | JSONFieldErrorServerComponent>
      Label?: CustomComponent<JSONFieldLabelClientComponent | JSONFieldLabelServerComponent>
    } & Admin['components']
    editorOptions?: EditorProps['options']
  } & Admin

  jsonSchema?: {
    fileMatch: string[]
    schema: JSONSchema4
    uri: string
  }
  type: 'json'
  validate?: Validate<Record<string, unknown>, unknown, unknown, JSONField>
} & Omit<FieldBase, 'admin'>

export type JSONFieldClient = {
  admin?: {
    components?: {
      afterInput?: MappedComponent[]
      beforeInput?: MappedComponent[]
      Error?: MappedComponent
      Label?: MappedComponent
    } & AdminClient['components']
  } & AdminClient &
    Pick<JSONField['admin'], 'editorOptions'>
} & Omit<FieldBaseClient, 'admin'> &
  Pick<JSONField, 'jsonSchema' | 'type'>

export type SelectField = {
  admin?: {
    components?: {
      afterInput?: CustomComponent[]
      beforeInput?: CustomComponent[]
      Error?: CustomComponent<SelectFieldErrorClientComponent | SelectFieldErrorServerComponent>
      Label?: CustomComponent<SelectFieldLabelClientComponent | SelectFieldLabelServerComponent>
    } & Admin['components']
    isClearable?: boolean
    isSortable?: boolean
  } & Admin
  /**
   * Customize the SQL table name
   */
  dbName?: DBIdentifierName
  /**
   * Customize the DB enum name
   */
  enumName?: DBIdentifierName
  hasMany?: boolean
  options: Option[]
  type: 'select'
  validate?: Validate<string, unknown, unknown, SelectField>
} & FieldBase

export type SelectFieldClient = {
  admin?: {
    components?: {
      afterInput?: MappedComponent[]
      beforeInput?: MappedComponent[]
      Error?: MappedComponent
      Label?: MappedComponent
    } & AdminClient['components']
  } & AdminClient &
    Pick<SelectField['admin'], 'isClearable' | 'isSortable'>
} & FieldBaseClient &
  Pick<SelectField, 'hasMany' | 'options' | 'type'>

type SharedRelationshipProperties = {
  filterOptions?: FilterOptions
  hasMany?: boolean
  /**
   * Sets a maximum population depth for this field, regardless of the remaining depth when this field is reached.
   *
   * {@link https://payloadcms.com/docs/getting-started/concepts#field-level-max-depth}
   */
  maxDepth?: number
  type: 'relationship'
  validate?: Validate<unknown, unknown, unknown, SharedRelationshipProperties>
} & (
  | {
      hasMany: true
      /**
       * @deprecated Use 'maxRows' instead
       */
      max?: number
      maxRows?: number
      /**
       * @deprecated Use 'minRows' instead
       */
      min?: number
      minRows?: number
    }
  | {
      hasMany?: false | undefined
      /**
       * @deprecated Use 'maxRows' instead
       */
      max?: undefined
      maxRows?: undefined
      /**
       * @deprecated Use 'minRows' instead
       */
      min?: undefined
      minRows?: undefined
    }
) &
  FieldBase

type SharedRelationshipPropertiesClient = FieldBaseClient &
  Pick<
    SharedRelationshipProperties,
    'hasMany' | 'max' | 'maxDepth' | 'maxRows' | 'min' | 'minRows' | 'type'
  >

type RelationshipAdmin = {
  allowCreate?: boolean
  components?: {
    Error?: CustomComponent<
      RelationshipFieldErrorClientComponent | RelationshipFieldErrorServerComponent
    >
    Label?: CustomComponent<
      RelationshipFieldLabelClientComponent | RelationshipFieldLabelServerComponent
    >
  } & Admin['components']
  isSortable?: boolean
} & Admin

type RelationshipAdminClient = {
  components?: {
    Error?: MappedComponent
    Label?: MappedComponent
  } & AdminClient['components']
} & AdminClient &
  Pick<RelationshipAdmin, 'allowCreate' | 'isSortable'>

export type PolymorphicRelationshipField = {
  admin?: {
    sortOptions?: { [collectionSlug: CollectionSlug]: string }
  } & RelationshipAdmin
  relationTo: CollectionSlug[]
} & SharedRelationshipProperties

export type PolymorphicRelationshipFieldClient = {
  admin?: {
    sortOptions?: Pick<PolymorphicRelationshipField['admin'], 'sortOptions'>
  } & RelationshipAdminClient
} & Pick<PolymorphicRelationshipField, 'relationTo'> &
  SharedRelationshipPropertiesClient

export type SingleRelationshipField = {
  admin?: {
    sortOptions?: string
  } & RelationshipAdmin
  relationTo: CollectionSlug
} & SharedRelationshipProperties

export type SingleRelationshipFieldClient = {
  admin?: Pick<SingleRelationshipField['admin'], 'sortOptions'> & RelationshipAdminClient
} & Pick<SingleRelationshipField, 'relationTo'> &
  SharedRelationshipPropertiesClient

export type RelationshipField = PolymorphicRelationshipField | SingleRelationshipField

export type RelationshipFieldClient =
  | PolymorphicRelationshipFieldClient
  | SingleRelationshipFieldClient

export type ValueWithRelation = {
  relationTo: CollectionSlug
  value: number | string
}

export function valueIsValueWithRelation(value: unknown): value is ValueWithRelation {
  return value !== null && typeof value === 'object' && 'relationTo' in value && 'value' in value
}

export type RelationshipValue =
  | (number | string)[]
  | (number | string)
  | ValueWithRelation
  | ValueWithRelation[]

export type RichTextField<
  TValue extends object = any,
  TAdapterProps = any,
  TExtraProperties = object,
> = {
  admin?: {
    components?: {
      Error?: CustomComponent
      Label?: CustomComponent
    } & Admin['components']
  } & Admin
  editor?:
    | RichTextAdapter<TValue, TAdapterProps, TExtraProperties>
    | RichTextAdapterProvider<TValue, TAdapterProps, TExtraProperties>
  /**
   * Sets a maximum population depth for this field, regardless of the remaining depth when this field is reached.
   *
   * {@link https://payloadcms.com/docs/getting-started/concepts#field-level-max-depth}
   */
  maxDepth?: number
  type: 'richText'
} & FieldBase &
  TExtraProperties

export type RichTextFieldClient<
  TValue extends object = any,
  TAdapterProps = any,
  TExtraProperties = object,
> = {
  admin?: {
    components?: {
      Error?: MappedComponent
      Label?: MappedComponent
    } & AdminClient['components']
    placeholder?: Record<string, string> | string
  } & AdminClient
  richTextComponentMap?: Map<string, any>
} & FieldBaseClient &
  Pick<RichTextField<TValue, TAdapterProps, TExtraProperties>, 'maxDepth' | 'type'> &
  TExtraProperties

export type ArrayField = {
  admin?: {
    components?: {
      Error?: CustomComponent<ArrayFieldErrorClientComponent | ArrayFieldErrorServerComponent>
      Label?: CustomComponent<ArrayFieldLabelClientComponent | ArrayFieldLabelServerComponent>
      RowLabel?: RowLabelComponent
    } & Admin['components']
    initCollapsed?: boolean
    /**
     * Disable drag and drop sorting
     */
    isSortable?: boolean
  } & Admin
  /**
   * Customize the SQL table name
   */
  dbName?: DBIdentifierName
  fields: Field[]
  /** Customize generated GraphQL and Typescript schema names.
   * By default, it is bound to the collection.
   *
   * This is useful if you would like to generate a top level type to share amongst collections/fields.
   * **Note**: Top level types can collide, ensure they are unique amongst collections, arrays, groups, blocks, tabs.
   */
  interfaceName?: string
  labels?: Labels
  maxRows?: number
  minRows?: number
  type: 'array'
  validate?: Validate<unknown[], unknown, unknown, ArrayField>
} & FieldBase

export type ArrayFieldClient = {
  admin?: {
    components?: {
      Error?: MappedComponent
      Label?: MappedComponent
      RowLabel?: MappedComponent
    } & AdminClient['components']
  } & AdminClient &
    Pick<ArrayField['admin'], 'initCollapsed' | 'isSortable'>
  fields: ClientField[]
  labels?: LabelsClient
} & FieldBaseClient &
  Pick<ArrayField, 'interfaceName' | 'maxRows' | 'minRows' | 'type'>

export type RadioField = {
  admin?: {
    components?: {
      Error?: CustomComponent<RadioFieldErrorClientComponent | RadioFieldErrorServerComponent>
      Label?: CustomComponent<RadioFieldLabelClientComponent | RadioFieldLabelServerComponent>
    } & Admin['components']
    layout?: 'horizontal' | 'vertical'
  } & Admin
  /**
   * Customize the SQL table name
   */
  dbName?: DBIdentifierName
  /**
   * Customize the DB enum name
   */
  enumName?: DBIdentifierName
  options: Option[]
  type: 'radio'
  validate?: Validate<string, unknown, unknown, RadioField>
} & FieldBase

export type RadioFieldClient = {
  admin?: {
    components?: {
      Error?: MappedComponent
      Label?: MappedComponent
    } & AdminClient['components']
  } & AdminClient &
    Pick<RadioField['admin'], 'layout'>
} & FieldBaseClient &
  Pick<RadioField, 'options' | 'type'>

export type Block = {
  /**
   * Do not set this property manually. This is set to true during sanitization, to avoid
   * sanitizing the same block multiple times.
   */
  _sanitized?: boolean
  admin?: {
    components?: {
      Label?: PayloadComponent<
        never,
        {
          blockKind: 'block' | 'lexicalBlock' | 'lexicalInlineBlock' | string
          /**
           * May contain the formData
           */
          formData: Record<string, any>
        }
      >
    }
    /** Extension point to add your custom data. Available in server and client. */
    custom?: Record<string, any>
  }
  /** Extension point to add your custom data. Server only. */
  custom?: Record<string, any>
  /**
   * Customize the SQL table name
   */
  dbName?: DBIdentifierName
  fields: Field[]
  /** @deprecated - please migrate to the interfaceName property instead. */
  graphQL?: {
    singularName?: string
  }
  imageAltText?: string
  imageURL?: string
  /** Customize generated GraphQL and Typescript schema names.
   * The slug is used by default.
   *
   * This is useful if you would like to generate a top level type to share amongst collections/fields.
   * **Note**: Top level types can collide, ensure they are unique amongst collections, arrays, groups, blocks, tabs.
   */
  interfaceName?: string
  labels?: Labels
  slug: string
}
export type ClientBlock = {
  admin?: {
    components?: {
      Label?: MappedComponent
    }
  } & Pick<Block['admin'], 'custom'>
  fields: ClientField[]
  labels?: LabelsClient
} & Pick<Block, 'imageAltText' | 'imageURL' | 'slug'>

export type BlocksField = {
  admin?: {
    components?: {
      Error?: CustomComponent<BlocksFieldErrorClientComponent | BlocksFieldErrorServerComponent>
    } & Admin['components']
    initCollapsed?: boolean
    /**
     * Disable drag and drop sorting
     */
    isSortable?: boolean
  } & Admin
  blocks: Block[]
  defaultValue?: unknown
  labels?: Labels
  maxRows?: number
  minRows?: number
  type: 'blocks'
  validate?: Validate<string, unknown, unknown, BlocksField>
} & FieldBase

export type BlocksFieldClient = {
  admin?: {
    components?: {
      Error?: MappedComponent
    } & AdminClient['components']
  } & AdminClient &
    Pick<BlocksField['admin'], 'initCollapsed' | 'isSortable'>
  blocks: ClientBlock[]
  labels?: LabelsClient
} & FieldBaseClient &
  Pick<BlocksField, 'maxRows' | 'minRows' | 'type'>

export type PointField = {
  admin?: {
    components?: {
      afterInput?: CustomComponent[]
      beforeInput?: CustomComponent[]
      Error?: CustomComponent<PointFieldErrorClientComponent | PointFieldErrorServerComponent>
      Label?: CustomComponent<PointFieldLabelClientComponent | PointFieldLabelServerComponent>
    } & Admin['components']
    placeholder?: Record<string, string> | string
    step?: number
  } & Admin
  type: 'point'
  validate?: Validate<unknown, unknown, unknown, PointField>
} & FieldBase

export type PointFieldClient = {
  admin?: {
    components?: {
      afterInput?: MappedComponent[]
      beforeInput?: MappedComponent[]
      Error?: MappedComponent
      Label?: MappedComponent
    } & AdminClient['components']
  } & AdminClient &
    Pick<PointField['admin'], 'placeholder' | 'step'>
} & FieldBaseClient &
  Pick<PointField, 'type'>

export type Field =
  | ArrayField
  | BlocksField
  | CheckboxField
  | CodeField
  | CollapsibleField
  | DateField
  | EmailField
  | GroupField
  | JSONField
  | NumberField
  | PointField
  | RadioField
  | RelationshipField
  | RichTextField
  | RowField
  | SelectField
  | TabsField
  | TextareaField
  | TextField
  | UIField
  | UploadField

export type ClientField =
  | ArrayFieldClient
  | BlocksFieldClient
  | CheckboxFieldClient
  | CodeFieldClient
  | CollapsibleFieldClient
  | DateFieldClient
  | EmailFieldClient
  | GroupFieldClient
  | JSONFieldClient
  | NumberFieldClient
  | PointFieldClient
  | RadioFieldClient
  | RelationshipFieldClient
  | RichTextFieldClient
  | RowFieldClient
  | SelectFieldClient
  | TabsFieldClient
  | TextareaFieldClient
  | TextFieldClient
  | UIFieldClient
  | UploadFieldClient

export type ClientFieldProps =
  | ArrayFieldClientProps
  | BlocksFieldClientProps
  | CheckboxFieldClientProps
  | CodeFieldClientProps
  | CollapsibleFieldClientProps
  | DateFieldClientProps
  | EmailFieldClientProps
  | GroupFieldClientProps
  | HiddenFieldProps
  | JSONFieldClientProps
  | NumberFieldClientProps
  | PointFieldClientProps
  | RadioFieldClientProps
  | RelationshipFieldClientProps
  | RichTextFieldClientProps
  | RowFieldClientProps
  | SelectFieldClientProps
  | TabsFieldClientProps
  | TextareaFieldClientProps
  | UploadFieldClientProps

type ExtractFieldTypes<T> = T extends { type: infer U } ? U : never

export type FieldTypes = ExtractFieldTypes<Field>

export type FieldAffectingData =
  | ArrayField
  | BlocksField
  | CheckboxField
  | CodeField
  | DateField
  | EmailField
  | GroupField
  | JSONField
  | NumberField
  | PointField
  | RadioField
  | RelationshipField
  | RichTextField
  | SelectField
  | TabAsField
  | TextareaField
  | TextField
  | UploadField

export type FieldAffectingDataClient =
  | ArrayFieldClient
  | BlocksFieldClient
  | CheckboxFieldClient
  | CodeFieldClient
  | DateFieldClient
  | EmailFieldClient
  | GroupFieldClient
  | JSONFieldClient
  | NumberFieldClient
  | PointFieldClient
  | RadioFieldClient
  | RelationshipFieldClient
  | RichTextFieldClient
  | SelectFieldClient
  | TabAsFieldClient
  | TextareaFieldClient
  | TextFieldClient
  | UploadFieldClient

export type NonPresentationalField =
  | ArrayField
  | BlocksField
  | CheckboxField
  | CodeField
  | CollapsibleField
  | DateField
  | EmailField
  | GroupField
  | JSONField
  | NumberField
  | PointField
  | RadioField
  | RelationshipField
  | RichTextField
  | RowField
  | SelectField
  | TabsField
  | TextareaField
  | TextField
  | UploadField

export type NonPresentationalFieldClient =
  | ArrayFieldClient
  | BlocksFieldClient
  | CheckboxFieldClient
  | CodeFieldClient
  | CollapsibleFieldClient
  | DateFieldClient
  | EmailFieldClient
  | GroupFieldClient
  | JSONFieldClient
  | NumberFieldClient
  | PointFieldClient
  | RadioFieldClient
  | RelationshipFieldClient
  | RichTextFieldClient
  | RowFieldClient
  | SelectFieldClient
  | TabsFieldClient
  | TextareaFieldClient
  | TextFieldClient
  | UploadFieldClient

export type FieldWithPath = {
  path?: string
} & Field

export type FieldWithPathClient = {
  path?: string
} & ClientField

export type FieldWithSubFields = ArrayField | CollapsibleField | GroupField | RowField

export type FieldWithSubFieldsClient =
  | ArrayFieldClient
  | CollapsibleFieldClient
  | GroupFieldClient
  | RowFieldClient

export type FieldPresentationalOnly = UIField
export type FieldPresentationalOnlyClient = UIFieldClient

export type FieldWithMany = RelationshipField | SelectField
export type FieldWithManyClient = RelationshipFieldClient | SelectFieldClient

export type FieldWithMaxDepth = RelationshipField | UploadField
export type FieldWithMaxDepthClient = RelationshipFieldClient | UploadFieldClient

export function fieldHasSubFields<TField extends ClientField | Field>(
  field: TField,
): field is TField & (TField extends ClientField ? FieldWithSubFieldsClient : FieldWithSubFields) {
  return (
    field.type === 'group' ||
    field.type === 'array' ||
    field.type === 'row' ||
    field.type === 'collapsible'
  )
}

export function fieldIsArrayType<TField extends ClientField | Field>(
  field: TField,
): field is TField & (TField extends ClientField ? ArrayFieldClient : ArrayField) {
  return field.type === 'array'
}

export function fieldIsBlockType<TField extends ClientField | Field>(
  field: TField,
): field is TField & (TField extends ClientField ? BlocksFieldClient : BlocksField) {
  return field.type === 'blocks'
}

export function fieldIsGroupType<TField extends ClientField | Field>(
  field: TField,
): field is TField & (TField extends ClientField ? GroupFieldClient : GroupField) {
  return field.type === 'group'
}

export function optionIsObject(option: Option): option is OptionObject {
  return typeof option === 'object'
}

export function optionsAreObjects(options: Option[]): options is OptionObject[] {
  return Array.isArray(options) && typeof options?.[0] === 'object'
}

export function optionIsValue(option: Option): option is string {
  return typeof option === 'string'
}

export function fieldSupportsMany<TField extends ClientField | Field>(
  field: TField,
): field is TField & (TField extends ClientField ? FieldWithManyClient : FieldWithMany) {
  return field.type === 'select' || field.type === 'relationship' || field.type === 'upload'
}

export function fieldHasMaxDepth<TField extends ClientField | Field>(
  field: TField,
): field is TField & (TField extends ClientField ? FieldWithMaxDepthClient : FieldWithMaxDepth) {
  return (
    (field.type === 'upload' || field.type === 'relationship') && typeof field.maxDepth === 'number'
  )
}

export function fieldIsPresentationalOnly<
  TField extends ClientField | Field | TabAsField | TabAsFieldClient,
>(
  field: TField,
): field is TField & (TField extends ClientField | TabAsFieldClient ? UIFieldClient : UIField) {
  return field.type === 'ui'
}

export function fieldIsSidebar<TField extends ClientField | Field | TabAsField | TabAsFieldClient>(
  field: TField,
): field is { admin: { position: 'sidebar' } } & TField {
  return 'admin' in field && 'position' in field.admin && field.admin.position === 'sidebar'
}

export function fieldAffectsData<
  TField extends ClientField | Field | TabAsField | TabAsFieldClient,
>(
  field: TField,
): field is TField &
  (TField extends ClientField | TabAsFieldClient ? FieldAffectingDataClient : FieldAffectingData) {
  return 'name' in field && !fieldIsPresentationalOnly(field)
}

export function tabHasName<TField extends ClientTab | Tab>(tab: TField): tab is NamedTab & TField {
  return 'name' in tab
}

export function fieldIsLocalized(field: Field | Tab): boolean {
  return 'localized' in field && field.localized
}

export type HookName =
  | 'afterChange'
  | 'afterRead'
  | 'beforeChange'
  | 'beforeRead'
  | 'beforeValidate'
