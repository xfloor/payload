import type { DrizzleSnapshotJSON } from 'drizzle-kit/api'
import type {
  ColumnBaseConfig,
  ColumnDataType,
  DrizzleConfig,
  Relation,
  Relations,
  SQL,
} from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type {
  ForeignKeyBuilder,
  IndexBuilder,
  PgColumn,
  PgEnum,
  pgEnum,
  PgInsertOnConflictDoUpdateConfig,
  PgSchema,
  PgTableWithColumns,
  UniqueConstraintBuilder,
} from 'drizzle-orm/pg-core'
import type { PgTableFn } from 'drizzle-orm/pg-core/table'
import type { Payload, PayloadRequest } from 'payload'
import type { QueryResult } from 'pg'

import type { Operators } from '../index.js'
import type { BuildQueryJoinAliases, DrizzleAdapter, TransactionPg } from '../types.js'

export type BaseExtraConfig = Record<
  string,
  (cols: GenericColumns) => ForeignKeyBuilder | IndexBuilder | UniqueConstraintBuilder
>

export type RelationMap = Map<string, { localized: boolean; target: string; type: 'many' | 'one' }>

export type GenericColumn = PgColumn<
  ColumnBaseConfig<ColumnDataType, string>,
  Record<string, unknown>
>

export type GenericColumns = {
  [x: string]: GenericColumn
}

export type GenericTable = PgTableWithColumns<{
  columns: GenericColumns
  dialect: string
  name: string
  schema: string
}>

export type GenericEnum = PgEnum<[string, ...string[]]>

export type GenericRelation = Relations<string, Record<string, Relation<string>>>

export type PostgresDB = NodePgDatabase<Record<string, unknown>>

export type CountDistinct = (args: {
  db: PostgresDB | TransactionPg
  joins: BuildQueryJoinAliases
  tableName: string
  where: SQL
}) => Promise<number>

export type DeleteWhere = (args: {
  db: PostgresDB | TransactionPg
  tableName: string
  where: SQL
}) => Promise<void>

export type DropDatabase = (args: { adapter: BasePostgresAdapter }) => Promise<void>

export type Execute<T> = (args: {
  db?: PostgresDB | TransactionPg
  drizzle?: PostgresDB
  raw?: string
  sql?: SQL<unknown>
}) => Promise<QueryResult<Record<string, T>>>

export type Insert = (args: {
  db: PostgresDB | TransactionPg
  onConflictDoUpdate?: PgInsertOnConflictDoUpdateConfig<any>
  tableName: string
  values: Record<string, unknown> | Record<string, unknown>[]
}) => Promise<Record<string, unknown>[]>

type Schema =
  | {
      enum: typeof pgEnum
      table: PgTableFn
    }
  | PgSchema

export type BasePostgresAdapter = {
  countDistinct: CountDistinct
  defaultDrizzleSnapshot: DrizzleSnapshotJSON
  deleteWhere: DeleteWhere
  drizzle: PostgresDB
  dropDatabase: DropDatabase
  enums: Record<string, GenericEnum>
  execute: Execute<unknown>
  /**
   * An object keyed on each table, with a key value pair where the constraint name is the key, followed by the dot-notation field name
   * Used for returning properly formed errors from unique fields
   */
  fieldConstraints: Record<string, Record<string, string>>
  idType: 'serial' | 'uuid'
  initializing: Promise<void>
  insert: Insert
  localesSuffix?: string
  logger: DrizzleConfig['logger']
  operators: Operators
  pgSchema?: Schema
  prodMigrations?: {
    down: (args: MigrateDownArgs) => Promise<void>
    name: string
    up: (args: MigrateUpArgs) => Promise<void>
  }[]
  push: boolean
  rejectInitializing: () => void
  relations: Record<string, GenericRelation>
  relationshipsSuffix?: string
  resolveInitializing: () => void
  schemaName?: string
  sessions: {
    [id: string]: {
      db: PostgresDB | TransactionPg
      reject: () => Promise<void>
      resolve: () => Promise<void>
    }
  }
  tableNameMap: Map<string, string>
  tables: Record<string, GenericTable>
  versionsSuffix?: string
} & PostgresDrizzleAdapter

export type PostgresDrizzleAdapter = Omit<
  DrizzleAdapter,
  | 'countDistinct'
  | 'deleteWhere'
  | 'drizzle'
  | 'dropDatabase'
  | 'execute'
  | 'insert'
  | 'operators'
  | 'relations'
>

export type IDType = 'integer' | 'numeric' | 'uuid' | 'varchar'

export type MigrateUpArgs = { payload: Payload; req?: Partial<PayloadRequest> }
export type MigrateDownArgs = { payload: Payload; req?: Partial<PayloadRequest> }
