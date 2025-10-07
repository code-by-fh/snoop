import React from "react";
import { jobStatusStyles, JobStatus } from "@/utils/jobStatusStyles";

interface JobStatusBadgeProps {
    isJobActive?: boolean;
  status: JobStatus;
  label?: string;
}

const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ status, label, isJobActive }) => {
  const { bgLight, bgDark, textLight, textDark, shimmer } = jobStatusStyles[status];

  return (
    <div
      className={`
        relative overflow-hidden text-center rounded-xl px-4 py-3
        transition-all duration-300
       ${!isJobActive ? "bg-gray-200 dark:bg-gray-700/60  text-gray-400 dark:text-gray-500" : `${bgLight} ${bgDark}`} 
      `}
    >
      {shimmer &&  (
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/40 via-green-200/80 to-green-100/40 animate-shimmer pointer-events-none rounded-xl"></div>
      )}

      <p
        className={`relative text-xs font-medium tracking-wide ${isJobActive ? `${textLight} ${textDark}` : "text-gray-400 dark:text-gray-500"} `}
      >
        Status
      </p>

      <p
        className={`relative text-base font-semibold capitalize ${isJobActive ? `${textLight} ${textDark}` : "text-gray-400 dark:text-gray-500"}`}
      >
        {label || status}
      </p>
    </div>
  );
};

export default JobStatusBadge;
