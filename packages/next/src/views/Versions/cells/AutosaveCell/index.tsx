'use client'
import { Pill, useConfig, useLocale, useTableCell, useTranslation } from '@payloadcms/ui'
import React, { Fragment } from 'react'

type AutosaveCellProps = {
  latestDraftVersion?: string
  latestPublishedVersion?: string
}

export const renderPill = (data, latestVersion, currentLabel, previousLabel, pillStyle) => {
  return (
    <React.Fragment>
      {data?.id === latestVersion ? (
        <Pill pillStyle={pillStyle}>{currentLabel}</Pill>
      ) : (
        <Pill>{previousLabel}</Pill>
      )}
      &nbsp;&nbsp;
    </React.Fragment>
  )
}

export const AutosaveCell: React.FC<AutosaveCellProps> = ({
  latestDraftVersion,
  latestPublishedVersion,
}) => {
  const { t } = useTranslation()
  const { rowData } = useTableCell()
  const {
    config: { localization },
  } = useConfig()
  const { code } = useLocale()
  const publishedLocale = rowData?.publishedLocale || undefined
  const status = rowData?.version._status
  let publishedLocalePill = null

  const versionInfo = {
    draft: {
      currentLabel: t('version:currentDraft'),
      latestVersion: latestDraftVersion,
      pillStyle: undefined,
      previousLabel: t('version:draft'),
    },
    published: {
      currentLabel: t('version:currentPublishedVersion'),
      latestVersion: latestPublishedVersion,
      pillStyle: 'success',
      previousLabel: t('version:previouslyPublished'),
    },
  }

  const { currentLabel, latestVersion, pillStyle, previousLabel } = versionInfo[status] || {}

  if (publishedLocale) {
    const locale = localization && localization.locales.find((loc) => loc.code === publishedLocale)
    const formattedLabel =
      typeof locale.label === 'string' ? locale.label : locale.label && locale.label[code]

    publishedLocalePill = <Pill pillStyle="warning">{formattedLabel} Only</Pill>
  }

  return (
    <Fragment>
      {rowData?.autosave && <Pill>{t('version:autosave')}</Pill>}
      {status && renderPill(rowData, latestVersion, currentLabel, previousLabel, pillStyle)}
      {publishedLocalePill}
    </Fragment>
  )
}
