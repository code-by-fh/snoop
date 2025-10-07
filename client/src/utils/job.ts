export const isFailed = (status: string) => {
  return status && status.toLowerCase() === "failed";
};

export const isRunning = (status: string) => {
  return status && status.toLowerCase() === "running";
};

export const isFinished = (status: string) => {
  return status && status.toLowerCase() === "finished";
};
