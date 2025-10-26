import { BarChart3, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoContentInfo = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
            <BarChart3 className="w-12 h-12 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                No Listings available yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
                You haven’t run any crawl jobs yet. Start by creating a new one to collect listings and see your analytics here.
            </p>
            <Link
                to="/jobs/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
            >
                <Plus className="w-4 h-4 mr-2" />
                Create New Crawl Job
            </Link>
        </div>
    );
};

export default NoContentInfo;
