import React from "react";
import { Star, StarOff } from "lucide-react";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  loading?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  loading = false,
  size = "md",
  className = "",
}) => {
  const sizeClasses = size === "sm" ? "p-1.5" : "p-2";

  return (
    <button
      onClick={onToggle}
      disabled={loading}
      className={`
        ${sizeClasses} rounded-full shadow-md transition z-10
        ${isFavorite
          ? "bg-yellow-400 text-black hover:bg-yellow-500 dark:bg-yellow-400 dark:hover:bg-yellow-500"
          : "bg-white text-gray-400 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}
        ${className}
      `}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <Star className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
      ) : (
        <StarOff className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
      )}
    </button>
  );
};

export default FavoriteButton;
