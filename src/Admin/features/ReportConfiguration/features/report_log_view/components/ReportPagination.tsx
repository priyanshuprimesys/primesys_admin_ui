import {
    Button,
    Flex,
} from "@chakra-ui/react";

interface Props {
    currentPage: number;
    totalPages: number;

    setCurrentPage: React.Dispatch<
        React.SetStateAction<number>
    >;
}

export const ReportPagination = ({
    currentPage,
    totalPages,
    setCurrentPage,
}: Props) => {

    return (

        <Flex
            mt={5}
            justifyContent="end"
            gap={3}
        >

            <Button
                size="sm"
                isDisabled={
                    currentPage === 1
                }
                onClick={() =>
                    setCurrentPage(
                        (prev) => prev - 1
                    )
                }
            >
                Previous
            </Button>

            <Button
                size="sm"
                isDisabled={
                    currentPage ===
                    totalPages
                }
                onClick={() =>
                    setCurrentPage(
                        (prev) => prev + 1
                    )
                }
            >
                Next
            </Button>

        </Flex>
    );
};