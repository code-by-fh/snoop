import { format } from 'date-fns';
import { getAvailableNotificators } from "../notification/adapter/index.js";
import { getAvailableProviders } from "../provider/index.js";
import Job from '../models/Job.js';
import logger from '#utils/logger.js';
import { getNewListings, getListings } from '../utils/jobUtils.js';

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


function findMostCommonPriceRange(listings, buckets) {
    const bucketStats = buckets.map(bucket => {
        const count = listings.filter(l => l.price >= bucket.min && l.price < bucket.max).length;
        return {
            min: bucket.min,
            max: bucket.max,
            count
        };
    });

    if (bucketStats.length === 0) return {};

    const mostCommon = bucketStats?.reduce((a, b) => (a.count > b.count ? a : b));

    return {
        min: mostCommon?.min,
        max: mostCommon?.max,
        count: mostCommon?.count
    };
}

function generatePriceTrends(listings) {
    const byMonth = {};

    listings.forEach(listing => {
        if (!listing.createdAt || typeof listing.price !== 'number') return;

        const date = new Date(listing.createdAt);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!byMonth[month]) byMonth[month] = [];
        byMonth[month].push(listing.price);
    });

    const result = Object.entries(byMonth)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([month, prices]) => {
            const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
            const median = getMedian(prices);
            return {
                month,
                avgPrice: Math.round(avg),
                medianPrice: median
            };
        });

    return result;
}

function generatePriceStats(listings, buckets) {
    const avgPrice = Math.floor(listings.reduce((sum, l) => sum + (l.price || 0), 0) / listings.length || 0);
    const medianPrice = getMedian(listings.map(l => l.price).filter(Boolean));

    const allPrices = listings.map(l => l.price).filter(Boolean);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    const priceTrends = generatePriceTrends(listings);

    const latest = priceTrends[priceTrends.length - 1];
    const previous = priceTrends[priceTrends.length - 2];

    let averageChange = null;
    let medianChange = null;

    if (latest && previous) {
        if (previous.avgPrice > 0) {
            const diff = latest.avgPrice - previous.avgPrice;
            averageChange = ((diff / previous.avgPrice) * 100).toFixed(1) + '%';
        }

        if (previous.medianPrice > 0) {
            const diff = latest.medianPrice - previous.medianPrice;
            medianChange = ((diff / previous.medianPrice) * 100).toFixed(1) + '%';
        }
    }

    return {
        range: {
            min: minPrice,
            max: maxPrice
        },
        mostCommonRange: findMostCommonPriceRange(listings, buckets),
        priceStats: {
            averagePrice: avgPrice,
            medianPrice,
            averageChange,
            medianChange
        },
        priceDistribution: buckets,
        priceTrends: generatePriceTrends(listings)

    };
}

function getPeakHour(listings) {
    const hours = Array(24).fill(0);
    listings.forEach(listing => {
        const raw = listing.createdAt?.$date || listing.createdAt;
        const hour = new Date(raw).getHours();
        hours[hour]++;
    });

    const peak = hours.reduce((max, count, hour) =>
        count > max.count ? { hour, count } : max, { hour: 0, count: 0 });

    return `${peak.hour.toString().padStart(2, '0')}:00`;
}

function getPeakDay(listings) {
    const weekdays = Array(7).fill(0);
    listings.forEach(listing => {
        const raw = listing.createdAt?.$date || listing.createdAt;
        const day = new Date(raw).getDay();
        weekdays[day]++;
    });

    const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const peakIndex = weekdays.indexOf(Math.max(...weekdays));
    return labels[peakIndex];
}

function getAvgListingsPerDay(listings) {
    const timestamps = listings.map(l => new Date(l.createdAt?.$date || l.createdAt).getTime());
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);

    const diffDays = Math.max(1, (maxTime - minTime) / (1000 * 60 * 60 * 24));
    return Math.round(listings.length / diffDays);
}

function getGrowthRate(listings) {
    const now = Date.now();
    const msDay = 86400 * 1000;

    let current = 0;
    let previous = 0;

    listings.forEach(listing => {
        const time = new Date(listing.createdAt?.$date || listing.createdAt).getTime();
        const diff = now - time;

        if (diff <= 7 * msDay) current++;
        else if (diff <= 14 * msDay) previous++;
    });

    if (previous === 0) return '+∞%';
    const growth = ((current - previous) / previous) * 100;
    return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
}

function buildTimeStats(listings) {
    return {
        daily: groupListingsByTime(listings, 'yyyy-MM-dd'),
        hourly: countByHour(listings),
        weekly: countByWeekday(listings),
        monthly: groupListingsByTime(listings, 'yyyy-MM'),
        timeStats: {
            peakHour: getPeakHour(listings),
            peakDay: getPeakDay(listings),
            avgListingsPerDay: getAvgListingsPerDay(listings),
            growthRate: getGrowthRate(listings)
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

export function generateDynamicPriceBuckets(listings, bucketCount = 5) {
    const prices = listings
        .map(l => l.price)
        .filter(p => typeof p === 'number' && !isNaN(p));

    const total = prices.length;
    if (total === 0) return [];

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (min === max) {
        return [{
            min,
            max,
            range: `${min}`,
            count: total,
            percentage: 100
        }];
    }

    const step = Math.ceil((max - min) / bucketCount);
    const buckets = [];

    for (let i = 0; i < bucketCount; i++) {
        const bucketMin = min + i * step;
        const bucketMax = bucketMin + step;

        const count = prices.filter(p => p >= bucketMin && p < bucketMax).length;

        buckets.push({
            min: bucketMin.toLocaleString(),
            max: bucketMax.toLocaleString(),
            range: `${bucketMin.toLocaleString()} – ${bucketMax.toLocaleString()} €`,
            count,
            percentage: +(count / total * 100).toFixed(1)
        });
    }

    return buckets;
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

        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const newListingsToday = allListings.filter(l => new Date(l.createdAt) >= todayMidnight);

        const priceBuckets = generateDynamicPriceBuckets(allListings);

        const totalJobsStats = buildMonthlyComparisonStats({
            items: jobs,
            dateKey: 'createdAt'
        });

        const activeJobsStats = buildMonthlyComparisonStats({
            items: jobs,
            dateKey: 'createdAt',
            filterFn: job => job.isActiveB
        });

        const totalListingsStats = buildMonthlyComparisonStats({
            items: allListings,
            dateKey: 'createdAt'
        });

        const newListingsTodayStats = buildMonthlyComparisonStats({
            items: allListings,
            dateKey: 'createdAt',
            filterFn: l => new Date(l.createdAt) > todayMidnight
        });

        const stats = {
            totalJobs: jobs.length,
            activeJobs: jobs.filter(job => job.isActive).length,
            totalListings: allListings.length,
            newListingsToday: newListingsToday.length,
            listingsByPrice: generatePriceStats(allListings, priceBuckets),
            listingsBySource: buildSourceStats(jobs, adapters, allListings),
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
        logger.error(error, 'Error generating dashboard stats:');
        res.status(500).json({ message: error.message });
    }
};

export const getJobStats = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
        const job = await Job.getJob(req.params.id, filter);

        if (!job) return res.status(404).json({ message: 'Job not found' });

        const listings = getListings(job);
        const newListingsToday = getNewListings(job);

        const listingsBySource = job.providers.map(provider => ({
            name: provider.id,
            value: (provider.listings || []).length,
        }));


        const listingsOverTime = groupListingsByTime(listings, 'yyyy-MM-dd');
        const months = listingsOverTime.map(l => l.date);

        const providerCount = job.providers.length;

        res.json({
            jobId: job.id,
            jobName: job.name,
            errors: job.errors,
            lastRun: job.lastRun,
            createdAt: job.createdAt,
            providerCount,
            totalListings: listings.length,
            newListingsToday,
            listingsBySource,
            listingsOverTime,
            processingTime: months.map(date => ({
                date,
                avgTimeMs: Math.floor(Math.random() * 300) + 100,
            })),
        });
    } catch (error) {
        logger.error(error, 'Error generating job stats:');
        res.status(500).json({ message: error.message });
    }
};
