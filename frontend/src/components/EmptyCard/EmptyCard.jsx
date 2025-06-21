import React from "react";
import { FiFileText, FiSearch } from "react-icons/fi";

const EmptyCard = ({ imgSrc, message, isSearch = false }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-6">
        {isSearch ? (
          <FiSearch className="w-12 h-12 text-primary-400 dark:text-primary-300" />
        ) : (
          <FiFileText className="w-12 h-12 text-primary-400 dark:text-primary-300" />
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
        {isSearch ? "No results found" : "No notes yet"}
      </h3>

      <p className="text-gray-600 dark:text-primary-200 text-center max-w-md leading-relaxed">
        {message}
      </p>

      {!isSearch && (
        <div className="mt-6 p-4 bg-primary-100 dark:bg-primary-900/30 rounded-lg border border-primary-200 dark:border-primary-800">
          <p className="text-sm text-primary-700 dark:text-primary-300 text-center">
            💡 <strong>Tip:</strong> Click the + button to create your first
            note!
          </p>
        </div>
      )}
    </div>
  );
};

export default EmptyCard;
