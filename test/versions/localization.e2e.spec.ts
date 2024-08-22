// TESTS - PUBLISH SPECIFIC LOCALE
// should not show any draft data from other locales
// latest version should not show any draft data

import type { BrowserContext, Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../helpers/sdk/index.js'
import type { Config } from './payload-types.js'

import {
  changeLocale,
  ensureCompilationIsDone,
  initPageConsoleErrorCatch,
  saveDocAndAssert,
} from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../helpers/reInitializeDB.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'
import { localizedCollectionSlug, localizedGlobalSlug } from './slugs.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>

let context: BrowserContext

describe('versions', () => {
  let page: Page
  let url: AdminUrlUtil
  let global: AdminUrlUtil
  let id: string
  let serverURL: string

  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)

    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({ dirname }))
    context = await browser.newContext()
    page = await context.newPage()

    initPageConsoleErrorCatch(page)
  })

  beforeEach(async () => {
    await reInitializeDB({
      serverURL,
      snapshotKey: 'versionsTest',
    })

    await ensureCompilationIsDone({ page, serverURL })
    // await clearAndSeedEverything(payload)
  })

  describe('Collections', () => {
    beforeAll(() => {
      url = new AdminUrlUtil(serverURL, localizedCollectionSlug)
      global = new AdminUrlUtil(serverURL, localizedGlobalSlug)
    })
    test('should show secondary actions on publish button', async () => {
      await page.goto(url.create)
      const publishOptions = page.locator('.doc-controls__controls .popup')

      await expect(publishOptions).toBeVisible()
    })

    test('should show current locale in publish specific locale button', async () => {
      await page.goto(url.create)
      const publishOptions = page.locator('.doc-controls__controls .popup')
      await publishOptions.click()

      const publishSpecificLocale = page.locator('.doc-controls__controls .popup__content')

      await expect(publishSpecificLocale).toContainText('en')
    })

    test('should publish specific locale', async () => {
      await page.goto(url.create)
      await changeLocale(page, 'es')
      const textField = page.locator('#field-text')
      const status = page.locator('.status__value')

      await textField.fill('spanish published')
      await saveDocAndAssert(page)
      await expect(status).toContainText('Published')

      await textField.fill('spanish draft')
      await saveDocAndAssert(page, '#action-save-draft')
      await expect(status).toContainText('Changed')

      await changeLocale(page, 'en')
      await textField.fill('english published')
      const publishOptions = page.locator('.doc-controls__controls .popup')
      await publishOptions.click()

      const publishSpecificLocale = page.locator('.popup-button-list button').first()
      await expect(publishSpecificLocale).toContainText('en')
      await publishSpecificLocale.click()

      id = await page.locator('.id-label').getAttribute('title')

      const data = await payload.find({
        collection: localizedCollectionSlug,
        locale: '*',
        where: {
          id: { equals: id },
        },
      })

      const publishedDoc = data.docs[0]

      expect(publishedDoc.text).toEqual({
        en: 'english published',
        es: 'spanish published',
      })
    })

    test('should show only published data in latest doc version', async () => {
      console.log(id)
      await page.goto(url.edit(id))

      const versionsTab = page.locator('.doc-tab', {
        hasText: 'Versions',
      })
      await versionsTab.waitFor({ state: 'visible' })
      await versionsTab.click()
      await expect(page.locator('.doc-versions__list')).toBeVisible()
    })
  })

  describe('Globals', () => {
    beforeAll(() => {
      url = new AdminUrlUtil(serverURL, localizedGlobalSlug)
    })

    test('global - should show secondary actions on publish button', async () => {
      await page.goto(url.global(localizedGlobalSlug))
      const publishOptions = page.locator('.doc-controls__controls .popup')

      await expect(publishOptions).toBeVisible()
    })

    test('global - should show current locale in publish specific locale button', async () => {
      await page.goto(url.global(localizedGlobalSlug))
      const publishOptions = page.locator('.doc-controls__controls .popup')
      await publishOptions.click()

      const publishSpecificLocale = page.locator('.doc-controls__controls .popup__content')

      await expect(publishSpecificLocale).toContainText('en')
    })
  })
})
