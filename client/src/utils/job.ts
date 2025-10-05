export const isFailed = (status: string) => {
  return status === "failed";
};

export const isRunning = (status: string) => {
  return status === "running";
};

export const isIdle = (status: string) => {
  return status === undefined;
};
