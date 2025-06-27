import { faker } from '@faker-js/faker';
import { SEED_CONFIG } from './config.js';

export function generateUsers() {
  const users = [];

  users.push({
    username: 'admin',
    email: 'admin@snnop.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  });

  users.push({
    username: 'user',
    email: 'user@snnop.com',
    password: 'user123',
    firstName: 'User',
    lastName: 'User',
    role: 'user'
  });

  for (let i = 0; i < SEED_CONFIG.users - 1; i++) {
    users.push({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: "Password123!",
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: 'user'
    });
  }

  return users;
}
