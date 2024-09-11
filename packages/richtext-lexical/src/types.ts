import type { EditorConfig as LexicalEditorConfig, SerializedEditorState } from 'lexical'
import type { RichTextAdapter, RichTextFieldClientProps, SanitizedConfig } from 'payload'

import type {
  BaseClientFeatureProps,
  FeatureProviderProviderClient,
} from './features/typesClient.js'
import type { FeatureProviderServer } from './features/typesServer.js'
import type { SanitizedServerEditorConfig } from './lexical/config/types.js'

export type LexicalFieldAdminProps = {
  /**
   * Controls if the gutter (padding to the left & gray vertical line) should be hidden. @default false
   */
  hideGutter?: boolean
}

export type LexicalEditorProps = {
  admin?: LexicalFieldAdminProps
  features?:
    | (({
        defaultFeatures,
        rootFeatures,
      }: {
        /**
         * This opinionated array contains all "recommended" default features.
         *
         * @Example
         *
         * ```ts
         *  editor: lexicalEditor({
         *    features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
         *  })
         *  ```
         */
        defaultFeatures: FeatureProviderServer<any, any, any>[]
        /**
         * This array contains all features that are enabled in the root richText editor (the one defined in the payload.config.ts).
         * If this field is the root richText editor, or if the root richText editor is not a lexical editor, this array will be empty.
         *
         * @Example
         *
         * ```ts
         *  editor: lexicalEditor({
         *    features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature()],
         *  })
         *  ```
         */
        rootFeatures: FeatureProviderServer<any, any, any>[]
      }) => FeatureProviderServer<any, any, any>[])
    | FeatureProviderServer<any, any, any>[]
  lexical?: LexicalEditorConfig
}

export type LexicalRichTextAdapter = {
  editorConfig: SanitizedServerEditorConfig
  features: FeatureProviderServer<any, any, any>[]
} & RichTextAdapter<SerializedEditorState, AdapterProps>

export type LexicalRichTextAdapterProvider =
  /**
   * This is being called during the payload sanitization process
   */
  ({
    config,
    isRoot,
    parentIsLocalized,
  }: {
    config: SanitizedConfig
    isRoot?: boolean
    parentIsLocalized: boolean
  }) => Promise<LexicalRichTextAdapter>

export type LexicalRichTextFieldProps = {
  admin: LexicalFieldAdminProps
  lexicalEditorConfig: LexicalEditorConfig
} & RichTextFieldClientProps<SerializedEditorState, AdapterProps, object>

export type AdapterProps = {
  editorConfig: SanitizedServerEditorConfig
}

export type GeneratedFeatureProviderComponent = {
  clientFeature: FeatureProviderProviderClient<any, any>
  clientFeatureProps: BaseClientFeatureProps<object>
}
