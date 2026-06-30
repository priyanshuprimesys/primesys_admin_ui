import {
    Box,
    Text,
    Flex,
    Icon,
    Progress,
} from "@chakra-ui/react";


interface DashboardCardProps {
    title: string;
    value: number;
    icon: any;
    color: string;
    progress: number;
}

export const DashboardCard = ({
    title,
    value,
    icon,
    color,
    progress,
}: DashboardCardProps) => {
    return (
        <Box
            bg="white"
            borderRadius="lg"
            p={3}
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            transition="0.2s"
            _hover={{
                boxShadow: "md",
                borderColor: `${color}.200`,
            }}
        >
            <Flex align="center" gap={3} mb={3}>

                <Flex
                    w="36px"
                    h="36px"
                    flexShrink={0}
                    align="center"
                    justify="center"
                    borderRadius="lg"
                    bg={`${color}.50`}
                >
                    <Icon
                        as={icon}
                        boxSize={4}
                        color={`${color}.500`}
                    />
                </Flex>

                <Box minW={0}>

                    <Text
                        fontSize="10px"
                        color="gray.500"
                        fontWeight="semibold"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        noOfLines={1}
                    >
                        {title}
                    </Text>

                    <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="gray.800"
                        lineHeight="1.1"
                    >
                        {value}
                    </Text>

                </Box>

            </Flex>

            <Progress
                value={progress}
                size="xs"
                colorScheme={color}
                borderRadius="full"
            />

        </Box>
    );
};
