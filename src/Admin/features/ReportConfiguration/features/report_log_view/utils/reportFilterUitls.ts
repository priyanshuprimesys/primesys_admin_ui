const options = [
    { name: "All" },
    { name: "All work done successfully." },
    { name: "Beat not covered" },
    { name: "Device was Off." },
    { name: "Overspeed" },
    { name: "Delay Start" },
    { name: "Early End" },
    {
        name: "Trip not schedule for this device.",
    },
    {
        name: "Near by RDPS not found or Working on off track.",
    },
];

export const getFilteredReports = (
    selectedReport: any,
    selectedRemark: string
) => {

    if (!selectedReport) {
        return [];
    }

    if (selectedRemark === "All") {
        return selectedReport.reports;
    }

    return selectedReport.reports.filter(
        (report: any) => {

            const remark =
                report.remark || "";

            return remark
                .toLowerCase()
                .includes(
                    selectedRemark.toLowerCase()
                );
        }
    );
};

export const getRemarkSummary = (
    selectedReport: any
) => {

    if (!selectedReport) {
        return [];
    }

    return options.map((item) => {

        const count =
            item.name === "All"
                ? selectedReport.reports.length
                : selectedReport.reports.filter(
                    (report: any) =>
                        (
                            report.remark || ""
                        )
                            .toLowerCase()
                            .includes(
                                item.name.toLowerCase()
                            )
                ).length;

        return {
            name: item.name,
            count,
        };
    });
};