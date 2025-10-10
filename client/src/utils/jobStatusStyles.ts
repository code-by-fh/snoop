// jobStatus.ts

export const jobStatusStyles = {
  waiting: {
    bgLight: "bg-gray-100",
    bgDark: "dark:bg-gray-800/60",
    textLight: "text-gray-700",
    textDark: "dark:text-gray-200",
    shimmer: false,
    icon: "⏳",
  },
  searching: {
    bgLight: "bg-blue-100",
    bgDark: "dark:bg-blue-900/20",
    textLight: "text-blue-700",
    textDark: "dark:text-blue-300",
    shimmer: true,
    icon: "🔍",
  },
  normalizing: {
    bgLight: "bg-purple-100",
    bgDark: "dark:bg-purple-900/20",
    textLight: "text-purple-700",
    textDark: "dark:text-purple-300",
    shimmer: true,
    icon: "⚙️",
  },
  filtering: {
    bgLight: "bg-yellow-100",
    bgDark: "dark:bg-yellow-900/20",
    textLight: "text-yellow-700",
    textDark: "dark:text-yellow-300",
    shimmer: true,
    icon: "🧹",
  },
  polishing: {
    bgLight: "bg-indigo-100",
    bgDark: "dark:bg-indigo-900/20",
    textLight: "text-indigo-700",
    textDark: "dark:text-indigo-300",
    shimmer: true,
    icon: "✨",
  },
  saving: {
    bgLight: "bg-green-100",
    bgDark: "dark:bg-green-900/20",
    textLight: "text-green-700",
    textDark: "dark:text-green-300",
    shimmer: true,
    icon: "💾",
  },
  notifying: {
    bgLight: "bg-teal-100",
    bgDark: "dark:bg-teal-900/20",
    textLight: "text-teal-700",
    textDark: "dark:text-teal-300",
    shimmer: true,
    icon: "📣",
  },
  finished: {
    bgLight: "bg-green-100",
    bgDark: "dark:bg-green-800/30",
    textLight: "text-green-800",
    textDark: "dark:text-green-300",
    shimmer: false,
    icon: "🎉",
  },
  failed: {
    bgLight: "bg-red-100",
    bgDark: "dark:bg-red-900/40",
    textLight: "text-red-800",
    textDark: "dark:text-red-300",
    shimmer: false,
    icon: "❌",
  },
  inactive: {
    bgLight: "bg-gray-200",
    bgDark: "dark:bg-gray-800/40",
    textLight: "text-gray-600",
    textDark: "dark:text-gray-400",
    shimmer: false,
    icon: "🚫",
  },
} as const;

export type JobStatus = keyof typeof jobStatusStyles;

export function getJobStatusStyle(status?: JobStatus, isActive?: boolean) {
  if (!status) {
    return isActive ? jobStatusStyles.waiting : jobStatusStyles.inactive;
  }

  switch (status.toLowerCase()) {
    case "searching":
      return jobStatusStyles.searching;
    case "normalizing":
      return jobStatusStyles.normalizing;
    case "filtering":
      return jobStatusStyles.filtering;
    case "polishing":
      return jobStatusStyles.polishing;
    case "saving":
      return jobStatusStyles.saving;
    case "notifying":
      return jobStatusStyles.notifying;
    case "finished":
      return jobStatusStyles.finished;
    case "failed":
      return jobStatusStyles.failed;
    case "waiting":
      return jobStatusStyles.waiting;
    case "inactive":
      return jobStatusStyles.inactive;
    default:
      // Fallback abhängig von isActive
      return isActive ? jobStatusStyles.waiting : jobStatusStyles.inactive;
  }
}