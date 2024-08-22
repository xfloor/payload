import type { SanitizedCollectionConfig, TypeWithID } from '../collections/config/types.js'
import type { FindOneArgs } from '../database/types.js'
import type { Payload, PayloadRequest } from '../types/index.js'
import type { TypeWithVersion } from './types.js'

import { docHasTimestamps } from '../types/index.js'

type Args = {
  config: SanitizedCollectionConfig
  id: number | string
  payload: Payload
  published?: boolean
  query: FindOneArgs
  req?: PayloadRequest
}

export const getLatestCollectionVersion = async <T extends TypeWithID = any>({
  id,
  config,
  payload,
  published,
  query,
  req,
}: Args): Promise<T> => {
  let latestVersion: TypeWithVersion<T>

  const whereQuery = published
    ? { and: [{ parent: { equals: id } }, { 'version._status': { equals: 'published' } }] }
    : { parent: { equals: id } }

  if (config.versions?.drafts) {
    const { docs } = await payload.db.findVersions<T>({
      collection: config.slug,
      limit: 1,
      pagination: false,
      req,
      sort: '-updatedAt',
      where: whereQuery,
    })
    ;[latestVersion] = docs
  }

  const doc = await payload.db.findOne<T>({ ...query, req })

  if (!latestVersion || (docHasTimestamps(doc) && latestVersion.updatedAt < doc.updatedAt)) {
    return doc
  }

  return {
    ...latestVersion.version,
    id,
    createdAt: latestVersion.createdAt,
    updatedAt: latestVersion.updatedAt,
  }
}
