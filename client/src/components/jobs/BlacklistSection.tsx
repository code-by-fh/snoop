import { Info, X } from 'lucide-react';
import React, { KeyboardEvent, useState } from 'react';

interface BlacklistSectionProps {
  blacklistTerms: string[];
  onUpdateBlacklist: (terms: string[]) => void;
}

const BlacklistSection: React.FC<BlacklistSectionProps> = ({
  blacklistTerms,
  onUpdateBlacklist
}) => {
  const [currentTerm, setCurrentTerm] = useState('');

  const handleAddTerm = (term: string) => {
    if (term && !blacklistTerms.includes(term.trim())) {
      onUpdateBlacklist([...blacklistTerms, term.trim()]);
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
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">Blacklist Configuration</h3>

      <div className="flex items-center space-x-2 text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200 dark:bg-gray-300">
        <Info className="h-5 w-5 text-blue-600" />
        <p className="text-sm">
          Add keywords or terms to exclude from crawling. Press <kbd className="px-1 bg-gray-100 rounded text-xs font-mono">Enter</kbd> or <kbd className="px-1 bg-gray-100 rounded text-xs font-mono">,</kbd> to add.
        </p>
      </div>

      <div>
        <label htmlFor="blacklistTerms" className="block text-sm font-medium text-gray-700 mb-1">
          Blacklist Terms
        </label>
        <input
          id="blacklistTerms"
          type="text"
          value={currentTerm}
          onChange={(e) => setCurrentTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition dark:bg-dark-input"
          placeholder="Enter terms to blacklist"
        />
      </div>

      {blacklistTerms.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {blacklistTerms.map((term, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
            >
              {term}
              <button
                type="button"
                onClick={() => handleRemoveTerm(term)}
                className="hover:text-red-500 text-gray-400 transition"
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
