import { useParams } from "react-router-dom";

export function getTime(time) {
    const formattedtime = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(time);
    return formattedtime;
}

export function getColorOnPercentage(percent) {
    let color = "";
    if (percent > 0 && percent <= 25) color = "#4A6CF7";
    else if (percent > 25 && percent <= 50) color = "#F887AD";
    else if (percent > 50 && percent <= 75) color = "#FAC65B";
    else if (percent > 75 && percent <= 99) color = "#d59133";
    else if (percent == 100) color = "#1FCE74";

    return color;
}

export function getToday(timestamp) {
    const today = new Intl.DateTimeFormat("en-US", {
        month: "short", // Apr
        day: "2-digit", // 20
        year: "numeric", // 2025
    }).format(new Date(timestamp))
    return today
}

export const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString();
};

export const extractDateTimeFromCreatedAt = (createdAt) => {
    if (!createdAt) return "";

    const date = new Date(createdAt);

    return {
        date: date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
};

export function getPercentage(part, total) { return ((part / total) * 100).toFixed(0) }

export const exportToJSON = (data, fileName = "data.json") => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};
