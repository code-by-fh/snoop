import jobEvents from '../runtime/JobEvents.js';
import logger from '#utils/logger.js';

const jobStatuses = {};

export function setupSocket(io) {
    io.on('connection', (socket) => {
        logger.debug('Client connected:', socket.id);

        socket.on('get-all-jobs-status', () => {
            socket.emit('all-jobs-status', jobStatuses);
        });

        const handleJobStatusEvent = (job) => {
            logger.debug(`Job status event received for id: ${job.id} - ${job.status}`);
            jobStatuses[job.id] = job;
            socket.emit('job-status', job);
        };

        jobEvents.on('jobStatusEvent', handleJobStatusEvent);

        socket.on('disconnect', () => {
            logger.debug('Client disconnected:', socket.id);
            jobEvents.off('jobStatusEvent', handleJobStatusEvent);
        });
    });
}
