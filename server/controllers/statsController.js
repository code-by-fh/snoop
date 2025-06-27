import { format } from 'date-fns';
import { getAvailableNotificators } from "../notification/adapter/index.js";
import { getAvailableProviders } from "../provider/index.js";
import Job from '../models/Job.js';


// ────────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ────────────────────────────────────────────────────────────────────────────────

function getMedian(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? Math.floor((sorted[mid - 1] + sorted[mid]) / 2)
        : sorted[mid];
}

function groupListingsByTime(listings, formatStr) {
    const map = {};
    for (const l of listings) {
        if (!l.createdAt) continue;
        const key = format(new Date(l.createdAt), formatStr);
        map[key] = (map[key] || 0) + 1;
    }
    return Object.entries(map)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count }));
}

function countByHour(listings) {
    const map = {};
    for (const l of listings) {
        if (!l.createdAt) continue;
        const hour = new Date(l.createdAt).getHours().toString().padStart(2, '0') + ':00';
        map[hour] = (map[hour] || 0) + 1;
    }
    return Object.entries(map).map(([hour, listings]) => ({ hour, listings }));
}

function countByWeekday(listings) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const map = {};
    const priceMap = {};

    for (const l of listings) {
        if (!l.createdAt) continue;
        const day = weekdays[new Date(l.createdAt).getDay()];
        map[day] = (map[day] || 0) + 1;
        priceMap[day] = priceMap[day] || [];
        if (l.price) priceMap[day].push(l.price);
    }

    return weekdays.map(day => ({
        day,
        listings: map[day] || 0,
        avgPrice: priceMap[day]?.length
            ? Math.floor(priceMap[day].reduce((a, b) => a + b, 0) / priceMap[day].length)
            : 0,
    }));
}

function calculatePriceDistribution(listings, buckets) {
    const validPrices = listings.map(l => l.price).filter(p => typeof p === 'number' && !isNaN(p));

    return buckets.map(bucket => {
        const count = validPrices.filter(p => p >= bucket.min && p < bucket.max).length;
        const percentage = validPrices.length ? Math.round((count / validPrices.length) * 100) : 0;
        return { range: bucket.range, count, percentage };
    });
}

function buildSourceStats(jobs, adapters) {
    const providerMap = {};

    jobs.forEach(job => {
        (job.providers || []).forEach(provider => {
            const listings = provider.listings || [];
            if (!providerMap[provider.id]) providerMap[provider.id] = [];
            providerMap[provider.id].push(...listings);
        });
    });

    const providers = Object.entries(providerMap).map(([id, listings]) => ({
        name: adapters.find(p => p.id === id)?.name || id,
        value: listings.length
    }));

    const performance = Object.entries(providerMap).map(([id, listings]) => ({
        name: adapters.find(p => p.id === id)?.name || id,
        listings: listings.length,
        successRate: Math.floor(80 + Math.random() * 15),
        avgResponseTime: (Math.random() * 2 + 1).toFixed(1),
        lastCrawl: 'Just now',
        status: 'active'
    }));

    return { providers, sourcePerformance: performance };
}

function generatePriceStats(listings, buckets) {
    const avgPrice = Math.floor(listings.reduce((sum, l) => sum + (l.price || 0), 0) / listings.length || 0);
    const medianPrice = getMedian(listings.map(l => l.price).filter(Boolean));

    return {
        range: buckets.map(bucket => ({
            range: bucket.range,
            count: listings.filter(l => l.price >= bucket.min && l.price < bucket.max).length
        })),
        priceStats: {
            averagePrice: avgPrice,
            medianPrice,
            priceChange: '+8.2%', // Dummy
            trend: 'up'
        },
        priceDistribution: calculatePriceDistribution(listings, buckets)
    };
}

function buildTimeStats(listings) {
    return {
        daily: groupListingsByTime(listings, 'yyyy-MM-dd'),
        hourly: countByHour(listings),
        weekly: countByWeekday(listings),
        monthly: groupListingsByTime(listings, 'yyyy-MM'),
        timeStats: {
            peakHour: '12:00 PM', // Dummy
            peakDay: 'Wednesday', // Dummy
            avgListingsPerDay: Math.round(listings.length / 30),
            growthRate: '+15.2%' // Dummy
        }
    };
}

function calculateChange(current, previous) {
    if (!previous || previous === 0) return "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : '-'}${change.toFixed(1)}%`;
}

function filterByMonth(items, dateKey, year, month) {
    return items.filter(item => {
        const date = new Date(item[dateKey]);
        return date.getFullYear() === year && date.getMonth() === month;
    });
}

function buildMonthlyComparisonStats({
    items,
    dateKey = 'createdAt',
    filterFn = null,
    currentDate = new Date()
}) {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentItems = filterByMonth(items, dateKey, currentYear, currentMonth);
    const previousItems = filterByMonth(items, dateKey, previousYear, previousMonth);

    const currentCount = filterFn ? currentItems.filter(filterFn).length : currentItems.length;
    const previousCount = filterFn ? previousItems.filter(filterFn).length : previousItems.length;

    return {
        value: currentCount,
        change: calculateChange(currentCount, previousCount)
    };
}

// ────────────────────────────────────────────────────────────────────────────────
// Main Controllers
// ────────────────────────────────────────────────────────────────────────────────

export const getDashboardStats = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
        const jobs = await Job.getAllJobs(filter);
        const adapters = Object.values(getAvailableNotificators());

        const allListings = jobs.flatMap(job => job.providers?.flatMap(p => p.listings || []) || []);

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const newListingsToday = allListings.filter(l => new Date(l.createdAt) > oneDayAgo).length;

        const priceBuckets = [
            { range: '0-500', min: 0, max: 500 },
            { range: '500-1000', min: 500, max: 1000 },
            { range: '1000-1500', min: 1000, max: 1500 },
            { range: '1500-2000', min: 1500, max: 2000 },
            { range: '2000+', min: 2000, max: Infinity }
        ];

        const totalJobsStats = buildMonthlyComparisonStats({
            items: jobs,
            dateKey: 'createdAt'
        });

        const activeJobsStats = buildMonthlyComparisonStats({
            items: jobs,
            dateKey: 'createdAt',
            filterFn: job => job.isActive
        });

        const totalListingsStats = buildMonthlyComparisonStats({
            items: allListings,
            dateKey: 'createdAt'
        });

        const newListingsTodayStats = buildMonthlyComparisonStats({
            items: allListings,
            dateKey: 'createdAt',
            filterFn: l => new Date(l.createdAt) > oneDayAgo
        });

        const stats = {
            totalJobs: jobs.length,
            activeJobs: jobs.filter(job => job.isActive).length,
            totalListings: allListings.length,
            newListingsToday,
            listingsBySource: buildSourceStats(jobs, adapters),
            listingsByPrice: generatePriceStats(allListings, priceBuckets),
            listingsByDate: buildTimeStats(allListings),
            meta: {
                totalJobsChange: totalJobsStats.change,
                activeJobsChange: activeJobsStats.change,
                totalListingsChange: totalListingsStats.change,
                newListingsTodayChange: newListingsTodayStats.change
            }
        };

        res.json(stats);
    } catch (error) {
        console.error('Error generating dashboard stats:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getJobStats = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
        const job = await Job.getJobWithListings(req.params.id, filter);

        if (!job) return res.status(404).json({ message: 'Job not found' });

        const listings = job.providers?.flatMap(p => p.listings || []) || [];
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const newListingsToday = listings.filter(l => new Date(l.createdAt) > oneDayAgo).length;

        const providers = getAvailableProviders();
        const listingsBySource = job.providers.map(provider => ({
            name: Object.values(providers).find(p => p.metaInformation.id === provider.id)?.metaInformation.name,
            value: (provider.listings || []).length,
        }));

        const priceBuckets = [
            { range: '0-1000', min: 0, max: 1000 },
            { range: '1000-2000', min: 1000, max: 2000 },
            { range: '2000-3000', min: 2000, max: 3000 },
            { range: '3000+', min: 3000, max: Infinity },
        ];

        const listingsOverTime = groupListingsByTime(listings, 'yyyy-MM');
        const months = listingsOverTime.map(l => l.date);

        res.json({
            jobId: job.id,
            jobName: job.name,
            totalListings: listings.length,
            newListingsToday,
            listingsBySource,
            listingsByPrice: generatePriceStats(listings, priceBuckets).range,
            listingsOverTime,
            errorsOverTime: months.map(date => ({ date, count: 0 })),
            processingTime: months.map(date => ({
                date,
                avgTimeMs: Math.floor(Math.random() * 300) + 100,
            })),
        });
    } catch (error) {
        console.error('Error generating job stats:', error);
        res.status(500).json({ message: error.message });
    }
};
