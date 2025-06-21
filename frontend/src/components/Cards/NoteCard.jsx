import React from "react";
import { FiTag, FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";
import moment from "moment";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onPinNote,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="card group hover:scale-[1.02] transition-all duration-300 p-6 relative overflow-hidden bg-white dark:bg-dark800">
      {/* Pin indicator */}
      {isPinned && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-primary-300 mt-1">
            {moment(date).format("MMM Do, YYYY")}
          </p>
        </div>

        <button
          onClick={onPinNote}
          className={`ml-2 p-2 rounded-lg transition-all duration-200 ${
            isPinned
              ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
              : "text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-dark-700"
          }`}
          title={isPinned ? "Unpin note" : "Pin note"}
        >
          <FiMapPin className={`w-4 h-4 ${isPinned ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed line-clamp-3">
          {content}
        </p>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
              >
                <FiTag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-700">
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
            title="Edit note"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>

          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            title="Delete note"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Pin status indicator */}
        {isPinned && (
          <div className="flex items-center text-xs text-primary-600 dark:text-primary-400 font-medium">
            <FiMapPin className="w-3 h-3 mr-1" />
            Pinned
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
    </div>
  );
};

export default NoteCard;
