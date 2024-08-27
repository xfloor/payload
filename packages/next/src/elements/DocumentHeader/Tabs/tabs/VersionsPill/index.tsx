'use client'
import { useDocumentInfo } from '@payloadcms/ui'
import React from 'react'

import { baseClass } from '../../Tab/index.js'

export const VersionsPill: React.FC = () => {
  const { versions } = useDocumentInfo()

  // To prevent CLS (versions are currently loaded client-side), render non-breaking space if there are no versions
  // The pill is already conditionally rendered to begin with based on whether the document is version-enabled
  // documents that are version enabled _always_ have at least one version
  const hasVersions = versions?.totalDocs > 0

  const versionsWithoutSnapshots = versions?.docs?.filter((version) => !version.snapshot)

  if (hasVersions)
    return (
      <span
        className={[`${baseClass}__count`, hasVersions ? `${baseClass}__count--has-count` : '']
          .filter(Boolean)
          .join(' ')}
      >
        {versionsWithoutSnapshots.length.toString()}
      </span>
    )
}
