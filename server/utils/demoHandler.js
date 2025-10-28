import dotenv from 'dotenv'
dotenv.config()

import logger from '#utils/logger.js'

const IS_DEMO = process.env.IS_DEMO || 'false'

export const isDemo = () => IS_DEMO === 'true'

export const demoRuntime = async ({ emitSocketEvent, jobId }) => {
  const demoEvents = ['Searching', 'Normalizing', 'Filtering', 'Polishing', 'Saving', 'Notifying']
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  for (const event of demoEvents) {
    await emitSocketEvent(event)
    logger.info(`[Demo] ${event} step simulated`)
    await delay(500)
  }

  logger.info(`[Demo] Demo mode enabled, skipping job '${jobId}'`)
  return []
}
