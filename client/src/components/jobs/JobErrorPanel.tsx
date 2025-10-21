import { JobStatistics } from "@/types/statistic";
import { AlertTriangle, Calendar, Globe } from "lucide-react";

const JobErrorPanel: React.FC<{ stats: JobStatistics }> = ({ stats }) => {

    if (!stats.runtimeErrors || stats.runtimeErrors.length === 0) {
        return (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                Keine Fehler vorhanden 🎉
            </p>
        );
    }

    return (
        <div id="runtimeErrors" className="space-y-4">
            {stats.runtimeErrors.map((error, index) => (
                <div
                    key={index}
                    className="flex items-start gap-4 p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 rounded-lg"
                >
                    <div className="flex-shrink-0 mt-1">
                        <AlertTriangle className="text-red-500 dark:text-red-400 w-5 h-5" />
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
                                {error.providerId || "Unbekannter Provider"}
                            </h3>
                            {error.timestamp && (
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(error.timestamp).toLocaleString()}
                                </div>
                            )}
                        </div>

                        {error.providerUrl && (
                            <a
                                href={error.providerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center mt-1"
                            >
                                <Globe className="w-3 h-3 mr-1" />
                                {error.providerUrl}
                            </a>
                        )}

                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                            {error.message || "Keine Fehlernachricht vorhanden."}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default JobErrorPanel;