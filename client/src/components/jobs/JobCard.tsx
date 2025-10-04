import { format, formatDistanceToNow } from "date-fns";
import { BarChart2, Edit, Play, Trash2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Job } from "../../types";
import JobToggleSwitch from "./JobToggleSwitch";
import NotificationIndicators from "./NotificationIndicators";

interface JobCardProps {
  job: Job;
  onDelete: (id: string) => void;
  onJobRun: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDelete, onJobRun, onToggleActive }) => {
  const navigate = useNavigate();

  const handleEditClick = () => navigate(`/jobs/${job.id}`);
  const handleViewStatisticsClick = () => navigate(`/jobs/${job.id}/statistics`);

  return (
    <div
      className={`flex flex-col bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700
        rounded-xl overflow-hidden transition-shadow duration-300
        hover:shadow-lg
        ${job.status === "failed" ? "ring-2 ring-red-200 dark:ring-red-400 bg-red-50 dark:bg-red-900/20" : ""}
        ${job.owner === false ? "ring-2 ring-yellow-400 dark:ring-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : ""}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <JobToggleSwitch
            jobId={job.id}
            isActive={job.isActive}
            onToggleActive={onToggleActive}
            jobStatus={job.status}
            size="sm"
          />
          <div className="min-w-0">
            <h3
              className={`text-base font-semibold truncate
                ${job.isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-400 italic line-through"}`}
              title={job.name}
            >
              {job.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {job.isActive ? "Job is active" : "Paused ⏸️"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={`p-4 flex-1 space-y-4 ${!job.isActive ? "bg-gray-100 dark:bg-gray-800/40" : ""}`}>
        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{job.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${job.isActive ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-400 dark:bg-gray-600"}`}
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500">Total</p>
            <p className={`text-lg font-semibold ${job.isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
              {job.totalListings}
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500">New</p>
            <p className={`text-lg font-semibold ${job.isActive ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
              {job.newListings}
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Notifications</p>
          <NotificationIndicators adapters={job.notificationAdapters || []} size="sm" maxDisplay={2} />
        </div>

        {/* Created / Last Run */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
          <p>Created {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
          <p>Last Run: {format(new Date(job.updatedAt), "MMM dd, yyyy HH:mm")}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-center">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleEditClick}
            className="btn-icon bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={() => onJobRun(job.id)}
            className="btn-icon bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
          >
            <Play className="w-3 h-3" />
          </button>
          <button
            onClick={handleViewStatisticsClick}
            className="btn-icon bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800"
          >
            <BarChart2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="btn-icon bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
