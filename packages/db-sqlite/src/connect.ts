import type { DrizzleAdapter } from '@payloadcms/drizzle/types'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type { Connect } from 'payload'

import { createClient } from '@libsql/client'
import { pushDevSchema } from '@payloadcms/drizzle'
import { drizzle } from 'drizzle-orm/libsql'

import type { SQLiteAdapter } from './types.js'

export const connect: Connect = async function connect(
  this: SQLiteAdapter,
  options = {
    hotReload: false,
  },
) {
  const { hotReload } = options

  this.schema = {
    ...this.tables,
    ...this.relations,
  }

  try {
    if (!this.client) {
      this.client = createClient(this.clientConfig)
    }

    const logger = this.logger || false
    this.drizzle = drizzle(this.client, { logger, schema: this.schema }) as LibSQLDatabase

    if (!hotReload) {
      if (process.env.PAYLOAD_DROP_DATABASE === 'true') {
        this.payload.logger.info(`---- DROPPING TABLES ----`)
        await this.dropDatabase({ adapter: this })
        this.payload.logger.info('---- DROPPED TABLES ----')
      }
    }
  } catch (err) {
    this.payload.logger.error({ err, msg: `Error: cannot connect to SQLite: ${err.message}` })
    if (typeof this.rejectInitializing === 'function') {
      this.rejectInitializing()
    }
    process.exit(1)
  }

  // Only push schema if not in production
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.PAYLOAD_MIGRATING !== 'true' &&
    this.push !== false
  ) {
    await pushDevSchema(this as unknown as DrizzleAdapter)
  }

  if (typeof this.resolveInitializing === 'function') {
    this.resolveInitializing()
  }

  if (process.env.NODE_ENV === 'production' && this.prodMigrations) {
    await this.migrate({ migrations: this.prodMigrations })
  }
}
