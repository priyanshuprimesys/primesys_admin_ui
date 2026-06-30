import { Accordion, AccordionItem, Box } from "@chakra-ui/react";
import { DivisionReportLogEntity } from "../../../data/reportLogSchema";
import { ReportAccordionCard } from "./ReportAccordionCard";

interface Props {
    reports: DivisionReportLogEntity[];
    handleReportUpdate: (
        e: React.ChangeEvent<HTMLInputElement>,
        reportId: string,
        status: boolean
    ) => void;
    handleDeleteReport: (
        e: React.MouseEvent<HTMLButtonElement>,
        reportId: string
    ) => void;
}

export const ReportLogAccordion = ({
    reports,
    handleReportUpdate,
    handleDeleteReport,
}: Props) => {

    return (
        <Accordion
            allowToggle
            display="flex"
            flexDirection="column"
            gap={4}
        >
            {reports.map((report) => (
                <AccordionItem
                    key={report.id}
                    border="none"
                >
                    <Box>
                        <ReportAccordionCard
                            report={report}
                            handleReportUpdate={handleReportUpdate}
                            handleDeleteReport={handleDeleteReport}
                        />
                    </Box>
                </AccordionItem>
            ))}
        </Accordion>
    );
};
