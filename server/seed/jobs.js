import { faker } from '@faker-js/faker';

export function generateJobs(userId, providerConfig) {
  const providers = {
      id: providerConfig.id,
      url: providerConfig.url,
      listings: []
    }

  return {
      name: `${providerConfig.id} - Seeded`,
      isActive: true,
      user: userId,
      providers,
      notificationAdapters: [
        { id: 'console', fields: {} }
      ],
      blacklistTerms: faker.word.words({ count: { min: 1, max: 3 } }).split(' ')
    }
}
