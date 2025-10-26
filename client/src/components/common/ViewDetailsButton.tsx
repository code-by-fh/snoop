import { ExternalLink } from "lucide-react";

interface ViewDetailsButtonProps {
  url: string;
}

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({ url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-4 py-2 w-full sm:w-auto text-center text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition"
    >
      <ExternalLink className="w-4 h-4 mr-2" />
      Details
    </a>
  );
};

export default ViewDetailsButton;
