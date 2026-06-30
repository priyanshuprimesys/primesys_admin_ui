// utils/date.ts

export const formatEpochDateTime = (
    epoch?: number | null
) => {

    if (!epoch) {
        return "-";
    }

    return new Date(epoch * 1000).toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
};

export const formatEpochDate = (
    epoch?: number | null
) => {

    if (!epoch) {
        return "-";
    }

    return new Date(epoch * 1000).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
};