import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import type { NextRESTClient } from '../helpers/NextRESTClient.js'

import { devUser } from '../credentials.js'
import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { clearAndSeedEverything } from './clearAndSeedEverything.js'
import { localizedCollectionSlug } from './slugs.js'

let payload: Payload
let restClient: NextRESTClient

let collectionLocalPostID: string
let collectionLocalVersionID: string

const collection = localizedCollectionSlug

const spanishDraft = 'Spanish draft'
const spanishPublished = 'Spanish published'
const englishPublished = 'English published'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Versions', () => {
  beforeAll(async () => {
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, restClient } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    if (typeof payload.db.destroy === 'function') {
      await payload.db.destroy()
    }
  })

  beforeEach(async () => {
    await clearAndSeedEverything(payload)

    const login = `
      mutation {
        loginUser(
          email: "${devUser.email}",
          password: "${devUser.password}"
        ) {
          token
        }
      }`
    const { data } = await restClient
      .GRAPHQL_POST({ body: JSON.stringify({ query: login }) })
      .then((res) => res.json())

    token = data.loginUser.token

    const localizedPost = await payload.create({
      collection,
      data: {
        text: spanishPublished,
      },
      draft: false,
      locale: 'es',
    })

    collectionLocalPostID = localizedPost.id

    await payload.update({
      id: collectionLocalPostID,
      collection,
      data: {
        text: spanishDraft,
      },
      draft: true,
      locale: 'es',
    })

    await payload.update({
      id: collectionLocalPostID,
      collection,
      data: {
        text: englishPublished,
      },
      draft: false,
      locale: 'en',
      publishSpecificLocale: 'en',
    })

    const versions = await payload.findVersions({
      collection,
      locale: 'all',
    })

    collectionLocalVersionID = versions.docs[0].id
  })

  describe('Collections', () => {
    it('should only show published data in doc', async () => {
      const doc = await payload.findByID({
        collection: localizedCollectionSlug,
        id: collectionLocalPostID,
        locale: 'all',
      })

      expect(doc.text).toStrictEqual({
        en: englishPublished,
        es: spanishPublished,
      })
    })

    it('should only show published data in versions', async () => {
      const version = await payload.findVersionByID({
        collection: localizedCollectionSlug,
        id: collectionLocalVersionID,
        locale: 'all',
      })

      expect(version.version.text).toStrictEqual({
        en: englishPublished,
        es: spanishPublished,
      })
    })
  })
})
