import { Badge } from "@chakra-ui/react";

const STATUS_SCHEME: Record<string, string> = {
    PENDING: "yellow",
    APPROVED: "green",
    REJECTED: "red",
};

export const WhitelistStatusBadge = ({ status }: { status?: string }) => {
    const value = (status ?? "").toUpperCase();
    const colorScheme = STATUS_SCHEME[value] ?? "gray";

    return (
        <Badge
            colorScheme={colorScheme}
            variant="subtle"
            px={2}
            py={0.5}
            borderRadius="md"
            fontSize="0.7rem"
        >
            {value || "—"}
        </Badge>
    );
};
