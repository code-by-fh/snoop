import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { generateUsers } from './users.js';
import { generateJobs as generateJob } from './jobs.js';
import { generateListings } from './listings.js';
import { SEED_CONFIG } from './config.js';

import User from '../models/User.js';
import Job from '../models/Job.js';
import Listing from '../models/Listing.js';
import Settings from '../models/Settings.js';

dotenv.config();

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        await Promise.all([
            Listing.deleteMany({}),
            Job.deleteMany({}),
            User.deleteMany({})
        ]);

        if (await Settings.countDocuments() === 0) {
            await Settings.create({});
            console.log('Default settings created.');
        }

        const users = await User.create(generateUsers());
        console.log(`Created ${users.length} users`);

        for (const user of users) {
            for (const provider of SEED_CONFIG.providersConfig) {

                const job = await Job.create(generateJob(user._id, provider));
                console.log(`Created job "${job.name}" for ${user.username}`);

                const listings = await Listing.create(generateListings(job._id, SEED_CONFIG.listingsPerJob));
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

                console.log(
                    `Added "${listingIds.length}" listings to provider "${provider.id}" in job "${job.name}"`
                );
            }
        }


        console.log('✅ Database seeding complete!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seedDatabase();
