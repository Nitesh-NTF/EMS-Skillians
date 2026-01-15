/**
 * StatusBadge Component
 * Reusable component to display status with dynamic styling based on status value
 * Supports: Active, Inactive, Pending, In Progress, Complete, Blocked, Start
 */

const statusStyles = {
  // Employee/User statuses
  Active: {
    text: "text-green-800",
    bg: "bg-[#C6F6D5]",
  },
  Inactive: {
    text: "text-red-800",
    bg: "bg-[#FED7D7]",
  },
  // Project statuses
  Start: {
    text: "text-blue-800",
    bg: "bg-[#BFEDF5]",
  },
  Pending: {
    text: "text-yellow-800",
    bg: "bg-[#FEF3C7]",
  },
  "In Progress": {
    text: "text-indigo-800",
    bg: "bg-[#E0E7FF]",
  },
  Complete: {
    text: "text-green-800",
    bg: "bg-[#A8EDD7]",
  },
  Blocked: {
    text: "text-red-800",
    bg: "bg-[#FCA5A5]",
  },
};

export const StatusBadge = ({
  status,
  onClick,
  className = "",
  isClickable = false,
}) => {
  const styles = statusStyles[status] || statusStyles.Inactive;

  return (
    <span
      onClick={onClick}
      className={`
        px-5 py-1 rounded-2xl mr-2 w-fit
        ${styles.text} ${styles.bg}
        ${
          isClickable
            ? "hover:bg-[#00000031] cursor-pointer transition-all"
            : ""
        }
        ${className}
      `}
    >
      {status}
    </span>
  );
};
