import { faker } from '@faker-js/faker';
import { buildHash } from '../utils/utils.js';

const today = new Date();

function randomCreatedAt() {
  return Math.random() < 0.3 ? today : faker.date.recent({ days: 50 });
}

export function generateListings(jobId, provider, count) {
  const listings = [];

  for (let i = 0; i < count; i++) {
    const city = faker.location.city();
    const street = faker.location.streetAddress();
    const title = `Wohnung in ${city}`;
    const price = faker.number.int({ min: 600, max: 3000 });

    listings.push({
      id: buildHash(title, price, city, street, faker.string.uuid()),
      title: title,
      price: price,
      location: {
        city,
        street,
        lat: faker.location.latitude(),
        lng: faker.location.longitude()
      },
      size: faker.number.int({ min: 40, max: 150 }),
      rooms: faker.number.int({ min: 1, max: 5 }),
      description: faker.lorem.sentences(2),
      imageUrl: `https://picsum.photos/seed/${faker.string.uuid()}/600/400`,
      url: faker.internet.url(),
      jobId: jobId,
      providerId: provider.id,
      providerName: provider.name,
      createdAt: randomCreatedAt(),
      updatedAt: new Date()
    });
  }

  return listings;
}
