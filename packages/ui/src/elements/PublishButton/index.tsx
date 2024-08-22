'use client'

import type { MappedComponent } from 'payload'

import * as qs from 'qs-esm'
import React, { useCallback } from 'react'

import { useForm, useFormModified } from '../../forms/Form/context.js'
import { FormSubmit } from '../../forms/Submit/index.js'
import { useHotkey } from '../../hooks/useHotkey.js'
import { RenderComponent } from '../../providers/Config/RenderComponent.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useEditDepth } from '../../providers/EditDepth/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { PopupList } from '../Popup/index.js'
export const DefaultPublishButton: React.FC<{
  label?: string
}> = ({ label: labelProp }) => {
  const {
    id,
    collectionSlug: collection,
    globalSlug: global,
    hasPublishPermission,
    publishedDoc,
    unpublishedVersions,
  } = useDocumentInfo()
  const { submit } = useForm()
  const modified = useFormModified()
  const editDepth = useEditDepth()
  const { code } = useLocale()
  const { config } = useConfig()

  const {
    localization,
    routes: { api },
    serverURL,
  } = config

  const { t } = useTranslation()
  const label = labelProp || t('version:publishChanges')

  const hasNewerVersions = unpublishedVersions?.totalDocs > 0
  const canPublish = hasPublishPermission && (modified || hasNewerVersions || !publishedDoc)

  useHotkey({ cmdCtrlKey: true, editDepth, keyCodes: ['s'] }, (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (submit) {
      void submit()
    }
  })

  const publish = useCallback(() => {
    void submit({
      overrides: {
        _status: 'published',
      },
    })
  }, [submit])

  const publishSpecificLocale = useCallback(
    (locale) => {
      const params = qs.stringify({
        publishSpecificLocale: locale,
      })

      const action = `${serverURL}${api}${
        global ? `/globals/${global}` : `/${collection}/${id ? `${'/' + id}` : ''}`
      }${params ? '?' + params : ''}`

      void submit({
        action,
        overrides: {
          _status: 'published',
        },
      })
    },
    [api, collection, global, id, serverURL, submit],
  )

  if (!hasPublishPermission) return null

  return (
    <FormSubmit
      SubMenuPopupContent={
        localization
          ? localization.locales.map((locale) => {
              const formattedLabel =
                typeof locale.label === 'string' ? locale.label : locale[code].label

              return (
                <PopupList.ButtonGroup key={locale.code}>
                  <PopupList.Button onClick={() => publishSpecificLocale(locale.code)}>
                    Publish {formattedLabel} only
                  </PopupList.Button>
                </PopupList.ButtonGroup>
              )
            })
          : null
      }
      buttonId="action-save"
      disabled={!canPublish}
      onClick={publish}
      size="medium"
      type="button"
    >
      {label}
    </FormSubmit>
  )
}

type Props = {
  CustomComponent?: MappedComponent
}

export const PublishButton: React.FC<Props> = ({ CustomComponent }) => {
  if (CustomComponent) return <RenderComponent mappedComponent={CustomComponent} />
  return <DefaultPublishButton />
}
