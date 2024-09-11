'use client'
import type { ClientCollectionConfig, Where } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import type { ListDrawerProps } from './types.js'

import { SelectMany } from '../../elements/SelectMany/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { usePayloadAPI } from '../../hooks/usePayloadAPI.js'
import { useThrottledEffect } from '../../hooks/useThrottledEffect.js'
import { XIcon } from '../../icons/X/index.js'
import { useAuth } from '../../providers/Auth/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { RenderComponent } from '../../providers/Config/RenderComponent.js'
import { ListInfoProvider } from '../../providers/ListInfo/index.js'
import { ListQueryProvider } from '../../providers/ListQuery/index.js'
import { usePreferences } from '../../providers/Preferences/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { useDocumentDrawer } from '../DocumentDrawer/index.js'
import { LoadingOverlay } from '../Loading/index.js'
import { Pill } from '../Pill/index.js'
import { type Option, ReactSelect } from '../ReactSelect/index.js'
import { TableColumnsProvider } from '../TableColumns/index.js'
import { ViewDescription } from '../ViewDescription/index.js'
import { baseClass } from './index.js'

const hoistQueryParamsToAnd = (where: Where, queryParams: Where) => {
  if ('and' in where) {
    where.and.push(queryParams)
  } else if ('or' in where) {
    where = {
      and: [where, queryParams],
    }
  } else {
    where = {
      and: [where, queryParams],
    }
  }

  return where
}

export const ListDrawerContent: React.FC<ListDrawerProps> = ({
  collectionSlugs,
  customHeader,
  drawerSlug,
  enableRowSelections,
  filterOptions,
  onBulkSelect,
  onSelect,
  selectedCollection,
}) => {
  const { i18n, t } = useTranslation()
  const { permissions } = useAuth()
  const { getPreference, setPreference } = usePreferences()
  const { closeModal, isModalOpen } = useModal()
  const [limit, setLimit] = useState<number>()
  // Track the page limit so we can reset the page number when it changes
  const previousLimit = useRef<number>(limit || null)
  const [sort, setSort] = useState<string>(null)
  const [page, setPage] = useState<number>(1)
  const [where, setWhere] = useState<Where>(null)
  const [search, setSearch] = useState<string>('')
  const [showLoadingOverlay, setShowLoadingOverlay] = useState<boolean>(true)
  const hasInitialised = useRef(false)

  const params = {
    limit,
    page,
    search,
    sort,
    where,
  }

  const {
    config: {
      collections,
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const enabledCollectionConfigs = collections.filter(({ slug }) => {
    return collectionSlugs.includes(slug)
  })

  const [selectedCollectionConfig, setSelectedCollectionConfig] = useState<ClientCollectionConfig>(
    () => {
      return (
        enabledCollectionConfigs.find(({ slug }) => slug === selectedCollection) ||
        enabledCollectionConfigs?.[0]
      )
    },
  )

  const List = selectedCollectionConfig?.admin?.components.views.list.Component

  const [selectedOption, setSelectedOption] = useState<Option | Option[]>(() =>
    selectedCollectionConfig
      ? {
          label: getTranslation(selectedCollectionConfig.labels.singular, i18n),
          value: selectedCollectionConfig.slug,
        }
      : undefined,
  )

  // allow external control of selected collection, same as the initial state logic above
  useEffect(() => {
    if (selectedCollection) {
      // if passed a selection, find it and check if it's enabled
      const selectedConfig =
        enabledCollectionConfigs.find(({ slug }) => slug === selectedCollection) ||
        enabledCollectionConfigs?.[0]
      setSelectedCollectionConfig(selectedConfig)
    }
  }, [selectedCollection, enabledCollectionConfigs, onSelect, t])

  const preferencesKey = `${selectedCollectionConfig.slug}-list`

  // this is the 'create new' drawer
  const [DocumentDrawer, DocumentDrawerToggler, { drawerSlug: documentDrawerSlug }] =
    useDocumentDrawer({
      collectionSlug: selectedCollectionConfig.slug,
    })

  useEffect(() => {
    if (selectedOption && !Array.isArray(selectedOption)) {
      setSelectedCollectionConfig(
        enabledCollectionConfigs.find(({ slug }) => selectedOption.value === slug),
      )
    }
  }, [selectedOption, enabledCollectionConfigs])

  const collectionPermissions = permissions?.collections?.[selectedCollectionConfig?.slug]
  const hasCreatePermission = collectionPermissions?.create?.permission

  // If modal is open, get active page of upload gallery
  const isOpen = isModalOpen(drawerSlug)
  const apiURL = isOpen ? `${serverURL}${api}/${selectedCollectionConfig.slug}` : null
  const [cacheBust, dispatchCacheBust] = useReducer((state) => state + 1, 0) // used to force a re-fetch even when apiURL is unchanged
  const [{ data, isError, isLoading: isLoadingList }, { setParams }] = usePayloadAPI(apiURL, {
    initialParams: {
      depth: 0,
    },
  })
  const moreThanOneAvailableCollection = enabledCollectionConfigs.length > 1

  useEffect(() => {
    const {
      slug,
      admin: { listSearchableFields, useAsTitle } = {},
      versions,
    } = selectedCollectionConfig

    const params: {
      cacheBust?: number
      depth?: number
      draft?: string
      limit?: number
      page?: number
      search?: string
      sort?: string
      where?: unknown
    } = {
      depth: 0,
    }

    let copyOfWhere = { ...(where || {}) }
    const filterOption = filterOptions?.[slug]

    if (filterOptions && typeof filterOption !== 'boolean') {
      copyOfWhere = hoistQueryParamsToAnd(copyOfWhere, filterOption)
    }

    if (search) {
      const searchAsConditions = (listSearchableFields || [useAsTitle]).map((fieldName) => {
        return {
          [fieldName]: {
            like: search,
          },
        }
      }, [])

      if (searchAsConditions.length > 0) {
        const searchFilter: Where = {
          or: [...searchAsConditions],
        }

        copyOfWhere = hoistQueryParamsToAnd(copyOfWhere, searchFilter)
      }
    }

    if (page) {
      params.page = page
    }
    if (sort) {
      params.sort = sort
    }
    if (cacheBust) {
      params.cacheBust = cacheBust
    }
    if (limit) {
      params.limit = limit

      if (limit !== previousLimit.current) {
        previousLimit.current = limit

        // Reset page if limit changes
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setPage(1)
      }
    }
    if (copyOfWhere) {
      params.where = copyOfWhere
    }
    if (versions?.drafts) {
      params.draft = 'true'
    }

    setParams(params)
  }, [
    page,
    sort,
    where,
    search,
    limit,
    cacheBust,
    filterOptions,
    selectedCollectionConfig,
    t,
    setParams,
  ])

  useEffect(() => {
    const newPreferences = {
      limit,
      sort,
    }

    if (limit || sort) {
      void setPreference(preferencesKey, newPreferences, true)
    }
  }, [sort, limit, setPreference, preferencesKey])

  // Get existing preferences if they exist
  useEffect(() => {
    if (preferencesKey && !limit) {
      const getInitialPref = async () => {
        const existingPreferences = await getPreference<{ limit?: number }>(preferencesKey)

        if (existingPreferences?.limit) {
          setLimit(existingPreferences?.limit)
        }
      }
      void getInitialPref()
    }
  }, [getPreference, limit, preferencesKey])

  useThrottledEffect(
    () => {
      if (isLoadingList) {
        setShowLoadingOverlay(true)
      }
    },
    1750,
    [isLoadingList, setShowLoadingOverlay],
  )

  useEffect(() => {
    if (isOpen) {
      hasInitialised.current = true
    } else {
      hasInitialised.current = false
    }
  }, [isOpen])

  useEffect(() => {
    if (!isLoadingList && showLoadingOverlay) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setShowLoadingOverlay(false)
    }
  }, [isLoadingList, showLoadingOverlay])

  const onCreateNew = useCallback(
    ({ doc }) => {
      if (typeof onSelect === 'function') {
        onSelect({
          collectionSlug: selectedCollectionConfig.slug,
          docID: doc.id,
        })
      }
      dispatchCacheBust()
      closeModal(documentDrawerSlug)
      closeModal(drawerSlug)
    },
    [closeModal, documentDrawerSlug, drawerSlug, onSelect, selectedCollectionConfig],
  )

  if (!selectedCollectionConfig || isError) {
    return null
  }

  return (
    <>
      {showLoadingOverlay && <LoadingOverlay />}
      <ListInfoProvider
        beforeActions={
          enableRowSelections
            ? [<SelectMany key="select-many" onClick={onBulkSelect} />]
            : undefined
        }
        collectionConfig={selectedCollectionConfig}
        collectionSlug={selectedCollectionConfig.slug}
        disableBulkDelete
        disableBulkEdit
        hasCreatePermission={hasCreatePermission}
        Header={
          <header className={`${baseClass}__header`}>
            <div className={`${baseClass}__header-wrap`}>
              <div className={`${baseClass}__header-content`}>
                <h2 className={`${baseClass}__header-text`}>
                  {!customHeader
                    ? getTranslation(selectedCollectionConfig?.labels?.plural, i18n)
                    : customHeader}
                </h2>
                {hasCreatePermission && (
                  <DocumentDrawerToggler className={`${baseClass}__create-new-button`}>
                    <Pill>{t('general:createNew')}</Pill>
                  </DocumentDrawerToggler>
                )}
              </div>
              <button
                aria-label={t('general:close')}
                className={`${baseClass}__header-close`}
                onClick={() => {
                  closeModal(drawerSlug)
                }}
                type="button"
              >
                <XIcon />
              </button>
            </div>
            {(selectedCollectionConfig?.admin?.description ||
              selectedCollectionConfig?.admin?.components?.Description) && (
              <div className={`${baseClass}__sub-header`}>
                <ViewDescription
                  Description={selectedCollectionConfig.admin?.components?.Description}
                  description={selectedCollectionConfig.admin?.description}
                />
              </div>
            )}
            {moreThanOneAvailableCollection && (
              <div className={`${baseClass}__select-collection-wrap`}>
                <FieldLabel field={null} label={t('upload:selectCollectionToBrowse')} />
                <ReactSelect
                  className={`${baseClass}__select-collection`}
                  onChange={setSelectedOption} // this is only changing the options which is not rerunning my effect
                  options={enabledCollectionConfigs.map((coll) => ({
                    label: getTranslation(coll.labels.singular, i18n),
                    value: coll.slug,
                  }))}
                  value={selectedOption}
                />
              </div>
            )}
          </header>
        }
        newDocumentURL={null}
      >
        <ListQueryProvider
          data={data}
          defaultLimit={limit || selectedCollectionConfig?.admin?.pagination?.defaultLimit}
          defaultSort={sort}
          handlePageChange={setPage}
          handlePerPageChange={setLimit}
          handleSearchChange={setSearch}
          handleSortChange={setSort}
          handleWhereChange={setWhere}
          modifySearchParams={false}
          // @ts-expect-error todo: fix types
          params={params}
          preferenceKey={preferencesKey}
        >
          <TableColumnsProvider
            cellProps={[
              {
                className: `${baseClass}__first-cell`,
                link: false,
                onClick: ({ collectionSlug: rowColl, rowData }) => {
                  if (typeof onSelect === 'function') {
                    onSelect({
                      collectionSlug: rowColl,
                      docID: rowData.id as string,
                    })
                  }
                },
              },
            ]}
            collectionSlug={selectedCollectionConfig.slug}
            enableRowSelections={enableRowSelections}
            preferenceKey={preferencesKey}
          >
            <RenderComponent mappedComponent={List} />
            <DocumentDrawer onSave={onCreateNew} />
          </TableColumnsProvider>
        </ListQueryProvider>
      </ListInfoProvider>
    </>
  )
}
