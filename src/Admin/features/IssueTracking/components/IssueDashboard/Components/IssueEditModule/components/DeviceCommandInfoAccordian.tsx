import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from "@chakra-ui/react"
import { ICommandsInterface } from "../Interface/DeviceInfoDetailResponse"
import React from "react"
import { getTimeStampToDate } from "../../../../../../../../utils/hooks/timeStampToDate/getTimeStampToDate"

interface DeviceCommandInterface {
    commandInfo: ICommandsInterface
}

const fmtTs = (ts?: number): string => {
    if (!ts) return "—";
    const d = String(ts).length > 10 ? new Date(ts) : new Date(ts * 1000);
    return d.getFullYear() < 2000 ? "—" : getTimeStampToDate(ts);
};

const rowCls = "flex items-center gap-2 mb-2 border-b border-gray-100 pb-1";

interface CmdEntry {
    label: string;
    data?: {
        command?: string;
        deliveredMsg?: string;
        deviceResponse?: string;
        deviceResponseTime?: number;
        loginName?: string;
        timestamp?: number;
    };
}

export const DeviceCommandInfoAccordian: React.FC<DeviceCommandInterface> = ({ commandInfo }) => {
    const entries: CmdEntry[] = [
        { label: "Fn Set",       data: commandInfo?.latestFnSet },
        { label: "Fn Check",     data: commandInfo?.latestFn },
        { label: "HBT Set",      data: commandInfo?.latestHbtSet },
        { label: "HBT Check",    data: commandInfo?.latestHbt },
        { label: "Period Set",   data: commandInfo?.latestPeriodSet },
        { label: "Period Check", data: commandInfo?.latestPeriod },
        { label: "SOS Set",      data: commandInfo?.latestSosSet },
        { label: "SOS Check",    data: commandInfo?.latestSos },
        { label: "TIMER Set",    data: commandInfo?.latestTimerSet },
        { label: "TIMER Check",  data: commandInfo?.latestTimer },
        { label: "Status",       data: commandInfo?.latestStatus },
        { label: "Param",        data: commandInfo?.latestParam },
    ];

    const visible = entries.filter(e =>
        e.data && (e.data.command || e.data.deviceResponse || e.data.deliveredMsg || e.data.loginName || (e.data.timestamp && e.data.timestamp > 0))
    );

    return (
        <div>
            {visible.length === 0 && (
                <p className="text-xs text-gray-400 italic py-2">No command data available.</p>
            )}
            <Accordion allowMultiple>
                {visible.map(({ label, data }) => (
                    <AccordionItem key={label}>
                        <h2>
                            <AccordionButton>
                                <Box as="span" flex="1" textAlign="left">
                                    <span className="font-semibold">{label}:</span>{" "}
                                    <span className="text-gray-500 text-sm">{fmtTs(data?.timestamp)}</span>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <div className={rowCls}>
                                <span className="font-medium w-36 flex-shrink-0">Command:</span>
                                <span>{data?.command ?? "—"}</span>
                            </div>
                            <div className={rowCls}>
                                <span className="font-medium w-36 flex-shrink-0">Delivered Msg:</span>
                                <span>{data?.deliveredMsg ?? "—"}</span>
                            </div>
                            <div className={rowCls}>
                                <span className="font-medium w-36 flex-shrink-0">Device Response:</span>
                                <span>{data?.deviceResponse ?? "—"}</span>
                            </div>
                            <div className={rowCls}>
                                <span className="font-medium w-36 flex-shrink-0">Response Time:</span>
                                <span>{fmtTs(data?.deviceResponseTime)}</span>
                            </div>
                            <div className={rowCls}>
                                <span className="font-medium w-36 flex-shrink-0">Command sent by:</span>
                                <span>{data?.loginName ?? "—"}</span>
                            </div>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
