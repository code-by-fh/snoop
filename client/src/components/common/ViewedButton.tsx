import { registerView } from "@/api";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface ViewedButtonProps {
    listingId: string;
    viewed: boolean;
    size?: "sm" | "md";
    className?: string;
}

const ViewedButton: React.FC<ViewedButtonProps> = ({
    listingId,
    viewed: initialViewed,
    size = "md",
    className = "",
}) => {
    const [viewed, setViewed] = useState(initialViewed);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (viewed || loading) return;

        setLoading(true);
        try {
            await registerView(listingId);
            setViewed(true);
        } catch (err) {
            toast.error("Failed to mark as viewed");
        } finally {
            setLoading(false);
        }
    };

    const sizeClasses = size === "sm" ? "p-1.5" : "p-2";

    return (
        <div onClick={handleClick}
            className={`
                ${className}
                ${sizeClasses} 
                ${viewed
                    ? "bg-yellow-400 text-black hover:bg-yellow-500 dark:bg-yellow-400"
                    : "cursor-pointer bg-white text-gray-400 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}
                rounded-full shadow-md transition flex items-center justify-center p-1 z-10 `}
            title={viewed ? "Already viewed" : "Mark as viewed"}
        >
            {viewed ? (
                <Eye className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"}`} />
            ) : (
                <EyeOff className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"}`} />
            )}
        </div>
    );
};

export default ViewedButton;
