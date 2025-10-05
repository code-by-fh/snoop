import { Info, X } from 'lucide-react';
import React, { KeyboardEvent, useState } from 'react';

interface BlacklistSectionProps {
  blacklistTerms: string[];
  onUpdateBlacklist: (terms: string[]) => void;
}

const BlacklistSection: React.FC<BlacklistSectionProps> = ({
  blacklistTerms,
  onUpdateBlacklist,
}) => {
  const [currentTerm, setCurrentTerm] = useState('');

  const handleAddTerm = (term: string) => {
    const trimmed = term.trim();
    if (trimmed && !blacklistTerms.includes(trimmed)) {
      onUpdateBlacklist([...blacklistTerms, trimmed]);
      setCurrentTerm('');
    }
  };

  const handleRemoveTerm = (termToRemove: string) => {
    onUpdateBlacklist(blacklistTerms.filter(term => term !== termToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTerm(currentTerm);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-3 mb-4">
        Blacklist Configuration
      </h3>

      <div className="flex items-center gap-2 bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-3 rounded-md border border-blue-200 dark:border-gray-600">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <p className="text-sm dark:text-gray-300">
          Add keywords to exclude from crawling. Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Enter</kbd> or <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">,</kbd> to add.
        </p>
      </div>

      <div>
        <label htmlFor="blacklistTerms" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Blacklist Terms
        </label>
        <input
          id="blacklistTerms"
          type="text"
          value={currentTerm}
          onChange={(e) => setCurrentTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter term to blacklist"
          className="w-full p-2.5 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 transition-colors"
        />
      </div>

      {blacklistTerms.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {blacklistTerms.map((term, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm text-sm font-medium"
            >
              {term}
              <button
                type="button"
                onClick={() => handleRemoveTerm(term)}
                className="p-1 rounded-full hover:bg-gray-300  transition-colors"
                aria-label={`Remove ${term}`}
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlacklistSection;
