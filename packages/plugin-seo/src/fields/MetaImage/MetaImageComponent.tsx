'use client'

import type { FieldType, Options } from '@payloadcms/ui'
import type { UploadFieldClientProps } from 'payload'

import {
  FieldLabel,
  UploadInput,
  useConfig,
  useDocumentInfo,
  useField,
  useFieldProps,
  useForm,
  useLocale,
  useTranslation,
} from '@payloadcms/ui'
import React, { useCallback } from 'react'

import type { PluginSEOTranslationKeys, PluginSEOTranslations } from '../../translations/index.js'
import type { GenerateImage } from '../../types.js'

import { Pill } from '../../ui/Pill.js'

type MetaImageProps = {
  readonly hasGenerateImageFn: boolean
} & UploadFieldClientProps

export const MetaImageComponent: React.FC<MetaImageProps> = (props) => {
  const {
    field: {
      admin: {
        components: { Label },
      },
      label,
      relationTo,
      required,
    },
    hasGenerateImageFn,
    labelProps,
  } = props || {}
  const { path: pathFromContext } = useFieldProps()

  const field: FieldType<string> = useField({ ...props, path: pathFromContext } as Options)

  const { t } = useTranslation<PluginSEOTranslations, PluginSEOTranslationKeys>()

  const locale = useLocale()
  const { getData } = useForm()
  const docInfo = useDocumentInfo()

  const { errorMessage, setValue, showError, value } = field

  const regenerateImage = useCallback(async () => {
    if (!hasGenerateImageFn) {
      return
    }

    const genImageResponse = await fetch('/api/plugin-seo/generate-image', {
      body: JSON.stringify({
        id: docInfo.id,
        slug: docInfo.slug,
        doc: getData(),
        docPermissions: docInfo.docPermissions,
        hasPublishPermission: docInfo.hasPublishPermission,
        hasSavePermission: docInfo.hasSavePermission,
        initialData: docInfo.initialData,
        initialState: docInfo.initialState,
        locale: typeof locale === 'object' ? locale?.code : locale,
        title: docInfo.title,
      } satisfies Omit<Parameters<GenerateImage>[0], 'req'>),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const generatedImage = await genImageResponse.text()

    setValue(generatedImage || '')
  }, [hasGenerateImageFn, docInfo, getData, locale, setValue])

  const hasImage = Boolean(value)

  const { config } = useConfig()

  const { collections, routes: { api } = {}, serverURL } = config

  const collection = collections?.find((coll) => coll.slug === relationTo) || undefined

  return (
    <div
      style={{
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          marginBottom: '5px',
          position: 'relative',
        }}
      >
        <div className="plugin-seo__field">
          <FieldLabel field={null} Label={Label} label={label} {...(labelProps || {})} />
          {hasGenerateImageFn && (
            <React.Fragment>
              &nbsp; &mdash; &nbsp;
              <button
                onClick={() => {
                  void regenerateImage()
                }}
                style={{
                  background: 'none',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'currentcolor',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
                type="button"
              >
                {t('plugin-seo:autoGenerate')}
              </button>
            </React.Fragment>
          )}
        </div>
        {hasGenerateImageFn && (
          <div
            style={{
              color: '#9A9A9A',
            }}
          >
            {t('plugin-seo:imageAutoGenerationTip')}
          </div>
        )}
      </div>
      <div
        style={{
          marginBottom: '10px',
          position: 'relative',
        }}
      >
        <UploadInput
          api={api}
          collection={collection}
          Error={{
            type: 'client',
            Component: null,
            RenderedComponent: errorMessage,
          }}
          filterOptions={field.filterOptions}
          label={undefined}
          onChange={(incomingImage) => {
            if (incomingImage !== null) {
              if (typeof incomingImage === 'object') {
                const { id: incomingID } = incomingImage
                setValue(incomingID)
              } else {
                setValue(incomingImage)
              }
            } else {
              setValue(null)
            }
          }}
          path={field.path}
          relationTo={relationTo}
          required={required}
          serverURL={serverURL}
          showError={showError}
          style={{
            marginBottom: 0,
          }}
          value={value}
        />
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          width: '100%',
        }}
      >
        <Pill
          backgroundColor={hasImage ? 'green' : 'red'}
          color="white"
          label={hasImage ? t('plugin-seo:good') : t('plugin-seo:noImage')}
        />
      </div>
    </div>
  )
}
