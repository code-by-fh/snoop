import jobEvents from '../runtime/JobEvents.js';
import logger from '../../utils/logger.js';

const jobStatuses = {};

export function setupSocket(io) {
    io.on('connection', (socket) => {
        logger.debug('Client connected:', socket.id);

        socket.on('get-all-jobs-status', () => {
            socket.emit('all-jobs-status', jobStatuses);
        });

        const handleJobStatusEvent = (data) => {
            logger.debug(`Job status event received: ${data.jobId} - ${data.status}`);
            jobStatuses[data.jobId] = data;
            socket.emit('job-status', data);
        };

        jobEvents.on('jobStatusEvent', handleJobStatusEvent);

        socket.on('disconnect', () => {
            logger.debug('Client disconnected:', socket.id);
            jobEvents.off('jobStatusEvent', handleJobStatusEvent);
        });
    });
}
