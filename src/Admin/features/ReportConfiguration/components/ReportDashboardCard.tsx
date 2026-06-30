import {
    Box,
    Flex,
    Icon,
    Text,
    VStack,
} from "@chakra-ui/react";

import { FiChevronRight } from "react-icons/fi";

interface Props {
    title: string;
    description: string;
    icon: any;
    color: string;
    onClick?: () => void;
}

export const ReportDashboardCard = ({
    title,
    description,
    icon,
    color,
    onClick,
}: Props) => {

    return (
        <Box
            bg="white"
            borderRadius="xl"
            p={5}
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
            cursor="pointer"
            transition="0.2s"
            _hover={{
                transform: "translateY(-3px)",
                boxShadow: "lg",
                borderColor: `${color}.300`,
            }}
            onClick={onClick}
        >

            <Flex
                justify="space-between"
                align="start"
                mb={4}
            >

                <Flex
                    w="52px"
                    h="52px"
                    borderRadius="xl"
                    bg={`${color}.100`}
                    align="center"
                    justify="center"
                >

                    <Icon
                        as={icon}
                        boxSize={6}
                        color={`${color}.500`}
                    />

                </Flex>

                <Icon
                    as={FiChevronRight}
                    color="gray.400"
                    boxSize={5}
                />

            </Flex>

            <VStack
                align="start"
                spacing={1}
            >

                <Text
                    fontSize="md"
                    fontWeight="700"
                >
                    {title}
                </Text>

                <Text
                    fontSize="sm"
                    color="gray.500"
                >
                    {description}
                </Text>

            </VStack>

        </Box>
    );
};