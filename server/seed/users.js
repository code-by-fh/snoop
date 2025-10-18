import { faker } from '@faker-js/faker';
import { SEED_CONFIG } from './config.js';

export const adminUser = {
    username: 'admin',
    email: 'admin@snnop.com',
    password: 'Password123!',
    role: 'admin'
  }

export function generateUsers() {
  const users = [];

  users.push(adminUser);

  users.push({
    username: 'user',
    email: 'user@snnop.com',
    password: 'Password123!',
    role: 'user'
  });

  for (let i = 0; i < SEED_CONFIG.users - 1; i++) {
    users.push({
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: "Password123!",
      role: 'user'
    });
  }

  return users;
}
