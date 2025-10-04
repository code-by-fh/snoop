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

  const isInactive = !job.isActive;

  return (
    <div
      className={`flex flex-col rounded-xl overflow-hidden border shadow-md transition-shadow duration-300
        ${isInactive ? "bg-gray-100 dark:bg-gray-800/40 border-gray-300 dark:border-gray-700" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-lg"}
        ${job.status === "failed" ? "ring-2 ring-red-200 dark:ring-red-400" : ""}
        ${job.owner === false ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}
      `}
    >
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-center border-gray-300 dark:border-gray-700`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <JobToggleSwitch
              jobId={job.id}
              isActive={job.isActive}
              onToggleActive={onToggleActive}
              jobStatus={job.status}
              size="sm"
            />
            <h3
              className={`text-base font-semibold truncate 
                ${isInactive ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-900 dark:text-gray-100"}`}
              title={job.name}
            >
              {job.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={`p-4 flex-1 space-y-4 
        ${isInactive ? "bg-gray-100 dark:bg-gray-800/40" : ""} 
        ${job.owner === false ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}
        `}>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`text-center p-2 rounded-lg ${isInactive ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"}`}>
            <p className={`text-xs ${isInactive ? "text-gray-400" : "text-gray-500"}`}>Total</p>
            <p className={`text-lg font-semibold ${isInactive ? "text-gray-400" : "text-gray-900 dark:text-gray-100"}`}>
              {job.totalListings}
            </p>
          </div>
          <div className={`text-center p-2 rounded-lg ${isInactive ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"}`}>
            <p className={`text-xs ${isInactive ? "text-gray-400" : "text-gray-500"}`}>New</p>
            <p className={`text-lg font-semibold ${isInactive ? "text-gray-400" : "text-green-600 dark:text-green-400"}`}>
              {job.newListings}
            </p>
          </div>
        </div>

        <hr className="my-4" />

        {/* Notifications */}
        <div className="text-center">
          <p className={`text-xs mb-2 ${isInactive ? "text-gray-400" : "text-gray-500"}`}>Notifications</p>
          <div className="flex justify-center">
            <NotificationIndicators adapters={job.notificationAdapters || []} size="sm" maxDisplay={5} isJobInactive={isInactive} />
          </div>
        </div>

        <hr className="my-4" />

        {/* Created / Last Run */}
        <div className={`text-xs text-center space-y-1 ${isInactive ? "text-gray-400" : "text-gray-500 dark:text-gray-400"}`}>
          <p>Created {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
          <p>Last Run: {format(new Date(job.updatedAt), "MMM dd, yyyy HH:mm")}</p>
        </div>
      </div>

      {/* Footer */}
      <div className={`px-4 py-3 flex justify-center border-t 
        ${isInactive ? "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600" : "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700"}
        ${job.owner === false ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}
        `}>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleEditClick}
            className={`btn-icon bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800`}
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onJobRun(job.id)}
            className={`btn-icon bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800`}
          >
            <Play className="w-5 h-5" />
          </button>
          <button
            onClick={handleViewStatisticsClick}
            className={`btn-icon bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800`}
          >
            <BarChart2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className={`btn-icon bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
