'use client'

import type { EditorConfig as LexicalEditorConfig } from 'lexical'

import type {
  ResolvedClientFeatureMap,
  SanitizedClientFeatures,
} from '../../../features/typesClient.js'
import type { LexicalFieldAdminProps } from '../../../types.js'
import type { SanitizedClientEditorConfig } from '../types.js'

export const sanitizeClientFeatures = (
  features: ResolvedClientFeatureMap,
): SanitizedClientFeatures => {
  const sanitized: SanitizedClientFeatures = {
    enabledFeatures: [],
    hooks: {
      load: [],
      save: [],
    },
    markdownTransformers: [],
    nodes: [],
    plugins: [],
    providers: [],
    slashMenu: {
      dynamicGroups: [],
      groups: [],
    },
    toolbarFixed: {
      groups: [],
    },
    toolbarInline: {
      groups: [],
    },
  }

  if (!features?.size) {
    return sanitized
  }

  features.forEach((feature) => {
    if (feature.hooks) {
      if (feature.hooks?.load?.length) {
        sanitized.hooks.load = sanitized.hooks.load.concat(feature.hooks.load)
      }
      if (feature.hooks?.save?.length) {
        sanitized.hooks.save = sanitized.hooks.save.concat(feature.hooks.save)
      }
    }

    if (feature.providers?.length) {
      sanitized.providers = sanitized.providers.concat(feature.providers)
    }

    if (feature.nodes?.length) {
      sanitized.nodes = sanitized.nodes.concat(feature.nodes)
    }
    if (feature.plugins?.length) {
      feature.plugins.forEach((plugin, i) => {
        sanitized.plugins.push({
          clientProps: feature.sanitizedClientFeatureProps,
          Component: plugin.Component,
          key: feature.key + i,
          position: plugin.position,
        })
      })
    }

    if (feature.toolbarInline?.groups?.length) {
      for (const group of feature.toolbarInline.groups) {
        // 1. find the group with the same key or create new one
        let foundGroup = sanitized.toolbarInline.groups.find(
          (sanitizedGroup) => sanitizedGroup.key === group.key,
        )
        if (!foundGroup) {
          foundGroup = {
            ...group,
            items: [],
          }
        } else {
          sanitized.toolbarInline.groups = sanitized.toolbarInline.groups.filter(
            (sanitizedGroup) => sanitizedGroup.key !== group.key,
          )
        }

        // 2. Add options to group options array and add to sanitized.slashMenu.groupsWithOptions
        if (group?.items?.length) {
          foundGroup.items = foundGroup.items.concat(group.items)
        }
        sanitized.toolbarInline?.groups.push(foundGroup)
      }
    }

    if (feature.toolbarFixed?.groups?.length) {
      for (const group of feature.toolbarFixed.groups) {
        // 1. find the group with the same key or create new one
        let foundGroup = sanitized.toolbarFixed.groups.find(
          (sanitizedGroup) => sanitizedGroup.key === group.key,
        )
        if (!foundGroup) {
          foundGroup = {
            ...group,
            items: [],
          }
        } else {
          sanitized.toolbarFixed.groups = sanitized.toolbarFixed.groups.filter(
            (sanitizedGroup) => sanitizedGroup.key !== group.key,
          )
        }

        // 2. Add options to group options array and add to sanitized.slashMenu.groupsWithOptions
        if (group?.items?.length) {
          foundGroup.items = foundGroup.items.concat(group.items)
        }
        sanitized.toolbarFixed?.groups.push(foundGroup)
      }
    }

    if (feature.slashMenu?.groups) {
      if (feature.slashMenu.dynamicGroups?.length) {
        sanitized.slashMenu.dynamicGroups = sanitized.slashMenu.dynamicGroups.concat(
          feature.slashMenu.dynamicGroups,
        )
      }

      for (const optionGroup of feature.slashMenu.groups) {
        // 1. find the group with the same name or create new one
        let group = sanitized.slashMenu.groups.find((group) => group.key === optionGroup.key)
        if (!group) {
          group = {
            ...optionGroup,
            items: [],
          }
        } else {
          sanitized.slashMenu.groups = sanitized.slashMenu.groups.filter(
            (group) => group.key !== optionGroup.key,
          )
        }

        // 2. Add options to group options array and add to sanitized.slashMenu.groupsWithOptions
        if (optionGroup?.items?.length) {
          group.items = group.items.concat(optionGroup.items)
        }
        sanitized.slashMenu.groups.push(group)
      }
    }

    if (feature.markdownTransformers?.length) {
      sanitized.markdownTransformers = sanitized.markdownTransformers.concat(
        feature.markdownTransformers,
      )
    }
    sanitized.enabledFeatures.push(feature.key)
  })

  // Sort sanitized.toolbarInline.groups by order property
  sanitized.toolbarInline.groups.sort((a, b) => {
    if (a.order && b.order) {
      return a.order - b.order
    } else if (a.order) {
      return -1
    } else if (b.order) {
      return 1
    } else {
      return 0
    }
  })
  // Sort sanitized.toolbarFixed.groups by order property
  sanitized.toolbarFixed.groups.sort((a, b) => {
    if (a.order && b.order) {
      return a.order - b.order
    } else if (a.order) {
      return -1
    } else if (b.order) {
      return 1
    } else {
      return 0
    }
  })

  // Sort sanitized.toolbarInline.groups.[group].entries by order property
  for (const group of sanitized.toolbarInline.groups) {
    group.items.sort((a, b) => {
      if (a.order && b.order) {
        return a.order - b.order
      } else if (a.order) {
        return -1
      } else if (b.order) {
        return 1
      } else {
        return 0
      }
    })
  }

  // Sort sanitized.toolbarFixed.groups.[group].entries by order property
  for (const group of sanitized.toolbarFixed.groups) {
    group.items.sort((a, b) => {
      if (a.order && b.order) {
        return a.order - b.order
      } else if (a.order) {
        return -1
      } else if (b.order) {
        return 1
      } else {
        return 0
      }
    })
  }

  return sanitized
}

export function sanitizeClientEditorConfig(
  resolvedClientFeatureMap: ResolvedClientFeatureMap,
  lexical?: LexicalEditorConfig,
  admin?: LexicalFieldAdminProps,
): SanitizedClientEditorConfig {
  return {
    admin,
    features: sanitizeClientFeatures(resolvedClientFeatureMap),
    lexical,
    resolvedFeatureMap: resolvedClientFeatureMap,
  }
}
