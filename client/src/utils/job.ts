import { JobStatus } from "./jobStatusStyles";

export const isFailed = (status: JobStatus) => {
  return status && status.toLowerCase() === "failed";
};

export const isRunning = (status: JobStatus) => {
  return status
    && status.toLowerCase() !== "finished"
    && status.toLowerCase() !== undefined;
};

export const isFinished = (status: JobStatus) => {
  return status && status.toLowerCase() === "finished";
};
