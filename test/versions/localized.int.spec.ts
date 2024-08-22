import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { localizedCollectionSlug } from './slugs.js'

let payload: Payload

const collection = localizedCollectionSlug

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Versions', () => {
  beforeAll(async () => {
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    if (typeof payload.db.destroy === 'function') {
      await payload.db.destroy()
    }
  })

  describe('Collections', () => {
    let postID: string

    beforeAll(async () => {
      await payload.delete({
        collection,
        where: {},
      })
    })

    it('should allow for publishing individual locales, not leaking draft data, and preserving existing draft data', async () => {
      const draft1 = await payload.create({
        collection,
        data: {
          text: 'Spanish draft',
        },
        draft: true,
        locale: 'es',
      })

      postID = draft1.id

      const draft2 = await payload.update({
        id: postID,
        collection,
        data: {
          text: 'English draft',
          description: 'My English description',
        },
        draft: true,
        locale: 'en',
      })

      const draft3 = await payload.update({
        id: postID,
        collection,
        data: {
          text: 'German draft',
        },
        draft: true,
        locale: 'de',
      })

      const publishedEN1 = await payload.update({
        id: postID,
        collection,
        data: {
          text: 'English published 1',
          _status: 'published',
        },
        draft: false,
        locale: 'en',
        publishSpecificLocale: 'en',
      })

      const docWithoutSpanishDraft = await payload.findByID({
        collection,
        id: postID,
        locale: 'all',
      })

      // We're getting the published version,
      // which should not leak any unpublished Spanish content
      // and should retain the English fields that were not explicitly
      // passed in from publishedEN1
      expect(docWithoutSpanishDraft.text.es).toBeUndefined()
      expect(docWithoutSpanishDraft.description.en).toStrictEqual('My English description')

      const docWithSpanishDraft1 = await payload.findByID({
        collection,
        id: postID,
        locale: 'all',
        draft: true,
      })

      // After updating English via specific locale,
      // We should expect to see that Spanish translations were maintained
      expect(docWithSpanishDraft1.text.es).toStrictEqual('Spanish draft')
      expect(docWithSpanishDraft1.text.en).toStrictEqual('English published 1')
      expect(docWithSpanishDraft1.description.en).toStrictEqual('My English description')

      const publishedEN2 = await payload.update({
        id: postID,
        collection,
        data: {
          text: 'English published 2',
          _status: 'published',
        },
        draft: false,
        locale: 'en',
        publishSpecificLocale: 'en',
      })

      const docWithoutSpanishDraft2 = await payload.findByID({
        collection,
        id: postID,
        locale: 'all',
      })

      // On the second consecutive publish of a specific locale,
      // Make sure we maintain draft data that has never been published
      // even after two + consecutive publish events
      expect(docWithoutSpanishDraft2.text.es).toBeUndefined()
      expect(docWithoutSpanishDraft2.text.en).toStrictEqual('English published 2')
      expect(docWithoutSpanishDraft2.description.en).toStrictEqual('My English description')

      await payload.update({
        id: postID,
        collection,
        data: {
          text: 'German draft 1',
          _status: 'draft',
        },
        draft: true,
        locale: 'de',
      })

      const docWithGermanDraft = await payload.findByID({
        collection,
        id: postID,
        locale: 'all',
        draft: true,
      })

      // Make sure we retain the Spanish draft,
      // which may be lost when we create a new draft with German.
      // Update operation should fetch both draft locales as well as published
      // and merge them.
      expect(docWithGermanDraft.text.de).toStrictEqual('German draft 1')
      expect(docWithGermanDraft.text.es).toStrictEqual('Spanish draft')
      expect(docWithGermanDraft.text.en).toStrictEqual('English published 2')

      const publishedDE = await payload.update({
        id: postID,
        collection,
        data: {
          _status: 'published',
          text: 'German published 1',
        },
        draft: false,
        locale: 'de',
        publishSpecificLocale: 'de',
      })

      const publishedENFinal = await payload.update({
        id: postID,
        collection,
        data: {
          text: 'English published 3',
          _status: 'published',
        },
        draft: false,
        locale: 'en',
        publishSpecificLocale: 'en',
      })

      const finalPublishedNoES = await payload.findByID({
        collection,
        id: postID,
        locale: 'all',
      })

      expect(finalPublishedNoES.text.de).toStrictEqual('German published 1')
      expect(finalPublishedNoES.text.en).toStrictEqual('English published 3')
      expect(finalPublishedNoES.text.es).toBeUndefined()

      const finalDraft = await payload.findByID({
        collection,
        id: postID,
        locale: 'all',
        draft: true,
      })

      expect(finalDraft.text.de).toStrictEqual('German published 1')
      expect(finalDraft.text.en).toStrictEqual('English published 3')
      expect(finalDraft.text.es).toStrictEqual('Spanish draft')

      const published = await payload.update({
        collection,
        id: postID,
        data: {
          _status: 'published',
        },
      })

      const finalPublished = await payload.findByID({
        collection,
        id: postID,
        locale: 'all',
        draft: true,
      })

      expect(finalPublished.text.de).toStrictEqual('German published 1')
      expect(finalPublished.text.en).toStrictEqual('English published 3')
      expect(finalPublished.text.es).toStrictEqual('Spanish draft')
    })
  })
})
