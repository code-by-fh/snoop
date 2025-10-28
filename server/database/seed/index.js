import dotenv from 'dotenv';
import { SEED_CONFIG } from './config.js';
import { generateJobs as generateJob } from './jobs.js';
import { generateListings } from './listings.js';
import { generateUsers } from './users.js';

import Job from '#models/Job.js';
import Listing from '#models/Listing.js';
import User from '#models/User.js';
import logger from '#utils/logger.js';

dotenv.config();

export async function seedDatabase() {
    try {

        const users = await User.create(generateUsers());
        logger.info(`Created ${users.length} users`);

        for (const user of users) {
            for (const provider of SEED_CONFIG.providersConfig) {

                const job = await Job.create(generateJob(user._id, provider));
                logger.info(`Created job "${job.name}" for ${user.username}`);

                const listings = await Listing.create(generateListings(job._id, provider, SEED_CONFIG.listingsPerJob));
                const listingIds = listings.map(listing => listing._id);

                await Job.updateOne(
                    { _id: job._id },
                    {
                        $push: {
                            'providers.$[provider].listings': {
                                $each: listingIds
                            }
                        }
                    },
                    {
                        arrayFilters: [{ 'provider.id': provider.id }]
                    }
                );

                logger.info(
                    `Added "${listingIds.length}" listings to provider "${provider.id}" in job "${job.name}"`
                );
            }
        }


        logger.info('✅ Database seeding complete!');
    } catch (err) {
        logger.error(err, 'Seeding failed:');
        process.exit(1);
    }
}
