import { getJobStatusStyle, JobStatus } from "@/utils/jobStatusStyles";
import React from "react";

interface JobStatusBadgeProps {
  jobid: string;
  isJobActive?: boolean;
  status?: JobStatus;
  label?: string;
}

const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({
  jobid,
  status,
  isJobActive,
}) => {
  const resolvedStatus = status ?? (isJobActive ? "waiting" : "inactive");
  const styles = getJobStatusStyle(resolvedStatus);
  const { bgLight, bgDark, textLight, textDark, shimmer, icon } = styles;
  console.log("JobStatusBadge", resolvedStatus, styles)
  const content = (
    <div
      className={`
        relative flex items-center justify-center
        rounded-xl px-4 py-3
        transition-all duration-300
        overflow-hidden
        ${!isJobActive
          ? "bg-gray-200 dark:bg-gray-700/60 text-gray-400 dark:text-gray-500"
          : `${bgLight} ${bgDark}`}
      `}
    >
      {/* Shimmer */}
      {shimmer && (
        <div className="absolute top-0 left-0 right-0 bottom-0 m-1 rounded-xl bg-gradient-to-r from-gray-100/30 via-gray-200/60 to-gray-100/30 animate-shimmer pointer-events-none"></div>
      )}

      {/* Text + Icon */}
      <p
        className={`relative flex items-center justify-center gap-2 text-base font-semibold capitalize ${isJobActive
            ? `${textLight} ${textDark}`
            : "text-gray-400 dark:text-gray-500"
          }`}
      >
        {icon && <span>{icon}</span>}
        {resolvedStatus}
      </p>
    </div>
  );

  return resolvedStatus.toLocaleLowerCase() === "failed" ? (
    <a
      href={`/jobs/${jobid}/statistics#runtimeErrors`}
      className="block hover:opacity-90 active:opacity-80 transition"
    >
      {content}
    </a>
  ) : (
    content
  );
};

export default JobStatusBadge;
