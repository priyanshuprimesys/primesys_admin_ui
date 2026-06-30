


class DateTimeUtil {

    formatToDateTime(epochSecond: number): string {
        const dateTime = new Date(epochSecond * 1000).toLocaleDateString([], {
            day: 'numeric', month: 'short', year: '2-digit', hour12: false,
            hour: '2-digit', minute: '2-digit'
        });
        return dateTime;
    }
}


export const dateTimeUtil = new DateTimeUtil();