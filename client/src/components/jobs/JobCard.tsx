import { useAuth } from "@/context/AuthContext";
import { format, formatDistanceToNow } from "date-fns";
import { BarChart2, Edit, Play, Trash2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Job } from "../../types";
import { isFinished, isRunning } from "../../utils/job";
import JobStatusBadge from "./JobStatusBadge";
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

  const isJobInactive = !job.isActive;
  const isJobFinished = isFinished(job.status);
  const isJobRunning = isRunning(job.status);

  const { user } = useAuth();
  const jobOwner = user?.id === job.user;

  return (
    <div
      className={`flex flex-col rounded-xl overflow-hidden shadow-md transition-shadow duration-300 border
        ${isJobInactive ? "bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-700" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-lg"}
        ${isJobFinished ? "" : ""}
        ${!jobOwner ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}
      `}>

      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-center border-gray-300 dark:border-gray-700`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <h3
              className={`text-base font-semibold truncate 
                ${isJobInactive ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-900 dark:text-gray-100"}`}
              title={job.name}
            >
              {job.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={`p-4 flex-1 space-y-4 
        ${isJobInactive ? "bg-gray-100 dark:bg-gray-800/40" : ""} 
        ${!jobOwner ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}
        `}>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {/* Total Listings */}
          <div className={`text-center p-3 rounded-lg ${isJobInactive ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"}`}>
            <p className={`text-xs ${isJobInactive ? "text-gray-400" : "text-gray-500"}`}>Total</p>
            <p className={`text-lg font-semibold ${isJobInactive ? "text-gray-400" : "text-blue-600 dark:text-blue-400"}`}>
              {job.totalListings}
            </p>
          </div>

          {/* New Listings */}
          <div className={`text-center p-3 rounded-lg ${isJobInactive ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"}`}>
            <p className={`text-xs ${isJobInactive ? "text-gray-400" : "text-gray-500"}`}>New</p>
            <p className={`text-lg font-semibold ${isJobInactive ? "text-gray-400" : "text-green-600 dark:text-green-400"}`}>
              {job.newListings}
            </p>
          </div>

          {/* Provider count */}
          <div className={`text-center p-3 rounded-lg ${isJobInactive ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"}`}>
            <p className={`text-xs ${isJobInactive ? "text-gray-400" : "text-gray-500"}`}>Providers</p>
            <p className={`text-lg font-semibold ${isJobInactive ? "text-gray-400" : "text-blue-600 dark:text-blue-400"}`}>
              {job.providers.length}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Job Status */}
          <JobStatusBadge jobid={job.id} status={job.status} isJobActive={job.isActive} />

          {/* Active Toggle */}
          <div className={`text-center p-3 rounded-lg ${isJobInactive ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-800"}`}>
            <p className={`text-xs font-bold`}>{job.isActive ? "Active" : "Inactive"}</p>
            <div className="flex justify-center mt-1">
              <JobToggleSwitch
                jobId={job.id}
                isActive={job.isActive}
                onToggleActive={onToggleActive}
                jobStatus={job.status}
              />
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* Notifications */}
        <div className="text-center">
          <p className={`text-xs mb-2 ${isJobInactive ? "text-gray-400" : "text-gray-500"}`}>Notifications</p>
          <div className="flex justify-center">
            <NotificationIndicators adapters={job.notificationAdapters || []} size="md" maxDisplay={5} isJobInactive={isJobInactive} />
          </div>
        </div>

        <hr className="my-4" />

        {/* Created / Last Run */}
        <div className={`text-xs text-center space-y-1 ${isJobInactive ? "text-gray-400" : "text-gray-500 dark:text-gray-400"}`}>
          <p>Created {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
          <p>
            Last Run: {job.lastRun ? format(new Date(job.lastRun), "MMM dd, yyyy HH:mm") : "–"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className={`px-4 py-3 flex justify-center border-t 
        ${isJobInactive ? "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600" : "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700"}
        ${jobOwner === false ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}
        `}>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleEditClick}
            className={`btn-icon bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800`}
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            disabled={isJobRunning || false}
            onClick={() => onJobRun(job.id)}
            className={`
                    btn-icon 
                    transition-colors duration-200
                    ${isJobRunning
                ? 'bg-green-200 text-green-400 dark:bg-green-900/20 dark:text-green-700 cursor-not-allowed opacity-90 hover:bg-green-200 dark:hover:bg-green-900/20'
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'}
                  `}>
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
