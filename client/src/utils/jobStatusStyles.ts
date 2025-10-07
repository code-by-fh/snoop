export const jobStatusStyles = {
  waiting: {
    bgLight: "bg-gray-100",
    bgDark: "dark:bg-gray-800/60",
    textLight: "text-gray-700",
    textDark: "dark:text-gray-200",
    shimmer: false,
  },
  running: {
    bgLight: "bg-green-100",
    bgDark: "dark:bg-green-300/10",
    textLight: "text-green-700",
    textDark: "dark:text-green-300",
    shimmer: true,
  },
  finished: {
    bgLight: "bg-green-100",
    bgDark: "dark:bg-green-900/40",
    textLight: "text-green-700",
    textDark: "dark:text-green-300",
    shimmer: false,
  },
  failed: {
    bgLight: "bg-red-100",
    bgDark: "dark:bg-red-900/40",
    textLight: "text-red-700",
    textDark: "dark:text-red-300",
    shimmer: false,
  }
} as const;

export type JobStatus = keyof typeof jobStatusStyles;
