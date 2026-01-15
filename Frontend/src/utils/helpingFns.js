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

export function getPercentage(part, total) { return ((part / total) * 100).toFixed(0) }

