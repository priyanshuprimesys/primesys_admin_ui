import {
    Box,
    Text,
} from "@chakra-ui/react";

interface Props {
    label: string;
    value: number;
    color: string;
}

export const StatBox = ({
    label,
    value,
    color,
}: Props) => {

    return (
        <Box
            bg="white"
            p={5}
            borderRadius="xl"
            boxShadow="sm"
        >

            <Text
                color="gray.500"
                fontSize="sm"
            >
                {label}
            </Text>

            <Text
                fontSize="3xl"
                fontWeight="bold"
                color={color}
            >
                {value}
            </Text>

        </Box>
    );
};