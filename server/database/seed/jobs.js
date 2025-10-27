import { faker } from '@faker-js/faker';

export function generateJobs(userId, providerConfig) {
  const providers = {
      id: providerConfig.id,
      url: providerConfig.url,
      listings: []
    }

  return {
      name: `${providerConfig.id} - Seeded`,
      isActive: process.env.IS_DEMO === 'true' ? Math.random() < 0.5 : false, // random active status for demo
      user: userId,
      providers,
      notificationAdapters: [
        { id: 'console', fields: {} }
      ],
      blacklistTerms: faker.word.words({ count: { min: 1, max: 3 } }).split(' ')
    }
}
