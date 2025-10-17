import { Server as SocketIO } from 'socket.io';
import jobEvents from './services/runtime/JobEvents.js'; 
import logger from '#utils/logger.js';

const jobStatuses = {};

export function setupSocketServer(server) {
  const io = new SocketIO(server, {
    path: '/ws',
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    logger.debug(`[WEBSOCKET] Total connected clients: ${io.engine.clientsCount}`);

    socket.on('get-all-jobs-status', () => {
      socket.emit('all-jobs-status', Object.values(jobStatuses));
    });

    const handleJobStatusEvent = (job) => {
      logger.debug(`[WEBSOCKET] Job status event received for id: ${job.id} - ${job.status}`);
      jobStatuses[job.id] = job;
      socket.emit('job-status', job);
    };

    jobEvents.on('jobStatusEvent', handleJobStatusEvent);

    socket.on('disconnect', () => {
      logger.debug(`[WEBSOCKET] Client disconnected (${socket.id}). Remaining: ${io.engine.clientsCount}`);
      jobEvents.off('jobStatusEvent', handleJobStatusEvent);
    });
  });

  return io;
}
