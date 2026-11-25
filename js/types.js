// @ts-check

/**
 * Shared JSDoc type definitions for The Pump Room static showcase.
 *
 * @typedef {Object} MetricItem
 * @property {string} label
 * @property {string} value
 *
 * @typedef {Object} BrandContent
 * @property {string} name
 * @property {string} domain
 * @property {string} statusLabel
 * @property {string} tagline
 * @property {string} description
 * @property {string} aboutHeading
 * @property {string} aboutCopy
 * @property {string} locationTag
 *
 * @typedef {Object} FeaturedContent
 * @property {string} badge
 * @property {string} title
 * @property {string} subtitle
 * @property {string} summary
 * @property {MetricItem[]} metrics
 * @property {string} projectId
 *
 * @typedef {Object} BenchStage
 * @property {string} index
 * @property {string} shortLabel
 * @property {string} badge
 * @property {string} subtitle
 * @property {string} title
 * @property {string} summary
 * @property {string} caption
 * @property {"eq"|"signal"|"grid"} visualMode
 * @property {MetricItem[]} metrics
 * @property {string} projectId
 *
 * @typedef {Object} CategoryItem
 * @property {string} id
 * @property {string} label
 *
 * @typedef {Object} ProjectLink
 * @property {string} label
 * @property {string} [href]
 * @property {"modal"} [action]
 *
 * @typedef {Object} ProjectItem
 * @property {string} id
 * @property {string} title
 * @property {string} category
 * @property {string} categoryLabel
 * @property {string} status
 * @property {"amber"|"green"|"cyan"} statusTone
 * @property {string} date
 * @property {"broadcast"|"grid"|"waveform"|"terminal"} visualStyle
 * @property {string} image
 * @property {string} summary
 * @property {string} details
 * @property {string[]} tags
 * @property {ProjectLink[]} links
 *
 * @typedef {Object} UpdateEntry
 * @property {string} date
 * @property {string} tag
 * @property {string} title
 * @property {string} body
 *
 * @typedef {Object} QuickLink
 * @property {string} label
 * @property {string} href
 * @property {string} note
 *
 * @typedef {Object} SiteContent
 * @property {BrandContent} brand
 * @property {FeaturedContent} featured
 * @property {BenchStage[]} [benchStages]
 * @property {CategoryItem[]} categories
 * @property {ProjectItem[]} projects
 * @property {UpdateEntry[]} updates
 * @property {QuickLink[]} links
 */

export {};
