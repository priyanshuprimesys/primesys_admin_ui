import { useContext, useState } from "react";
import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    Icon,
    Badge,
    Code,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
} from "@chakra-ui/react";
import { FiPlay, FiSquare, FiServer, FiExternalLink, FiActivity, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";

import { UserDetailContext } from "../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import {
    useControlErlangServer,
    useGenerateOtp,
    useVerifyOtp,
} from "../data/queryOptions";
import { ServerAction, ServerControlResult } from "../data/schema";

/** HAProxy stats page (opens in a new tab — not embeddable due to X-Frame-Options). */
const HAPROXY_STATS_URL = "http://mykidtrackers.in:9000/haproxy_stats";

interface LastRun extends ServerControlResult {
    action: ServerAction;
    at: number;
}

export const ServerControlSection = () => {
    const { userDetail } = useContext(UserDetailContext);
    const userName = userDetail?.data?.result?.userName || "";

    const control = useControlErlangServer();
    const generateOtp = useGenerateOtp();
    const verifyOtp = useVerifyOtp();

    const [pending, setPending] = useState<ServerAction | null>(null);
    const [otpAction, setOtpAction] = useState<ServerAction | null>(null);
    const [otp, setOtp] = useState("");
    const [lastRun, setLastRun] = useState<LastRun | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();

    // Step 1 — request an OTP, then open the verification dialog for this action.
    const handleActionClick = (action: ServerAction) => {
        if (!userName) {
            toast.error("User not loaded — cannot send OTP.");
            return;
        }
        setOtpAction(action);
        setOtp("");
        generateOtp.mutate(userName, {
            onSuccess: () => {
                toast.info("OTP sent to your registered email/mobile.");
                onOpen();
            },
            onError: (err) =>
                toast.error((err as Error)?.message || "Failed to send OTP"),
        });
    };

    const closeOtp = () => {
        onClose();
        setOtpAction(null);
        setOtp("");
    };

    // Step 3 — run the start/stop once the OTP is verified.
    const execute = (action: ServerAction) => {
        setPending(action);
        control.mutate(action, {
            onSuccess: (result) => {
                setLastRun({ action, at: Date.now(), ...result });
                toast.success(`Erlang server ${action.toLowerCase()} triggered.`);
            },
            onError: (err) =>
                toast.error(
                    (err as Error)?.message ||
                    `Failed to ${action.toLowerCase()} server`
                ),
            onSettled: () => setPending(null),
        });
    };

    // Step 2 — verify the entered OTP, then execute on success.
    const handleVerifyAndExecute = () => {
        if (!otpAction) return;
        if (!otp.trim()) {
            toast.warn("Enter the OTP.");
            return;
        }
        verifyOtp.mutate(
            { userId: userName, otp: otp.trim() },
            {
                onSuccess: (verified) => {
                    if (!verified) {
                        toast.error("Invalid or expired OTP.");
                        return;
                    }
                    const action = otpAction;
                    closeOtp();
                    execute(action);
                },
                onError: (err) =>
                    toast.error((err as Error)?.message || "OTP verification failed"),
            }
        );
    };

    const busy = generateOtp.isPending || pending !== null || otpAction !== null;

    return (
        <Box>
            <Flex align="center" gap={2} mb={1}>
                <Icon as={FiServer} boxSize={6} color="purple.500" />
                <Heading size="md">Erlang Server Control</Heading>
            </Flex>
            <Text fontSize="sm" color="gray.500" mb={4}>
                Start or stop the erlang server on the production host. Each action
                requires an OTP sent to your registered email/mobile, and affects
                live device connectivity — use with care.
            </Text>

            <Flex gap={3} wrap="wrap" mb={4} align="center">
                <Button
                    colorScheme="green"
                    leftIcon={<FiPlay />}
                    onClick={() => handleActionClick("START")}
                    isLoading={
                        (generateOtp.isPending || pending === "START") &&
                        otpAction === "START"
                    }
                    isDisabled={busy}
                    loadingText={pending === "START" ? "Starting" : "Sending OTP"}
                >
                    Start Server
                </Button>
                <Button
                    colorScheme="red"
                    leftIcon={<FiSquare />}
                    onClick={() => handleActionClick("STOP")}
                    isLoading={
                        (generateOtp.isPending || pending === "STOP") &&
                        otpAction === "STOP"
                    }
                    isDisabled={busy}
                    loadingText={pending === "STOP" ? "Stopping" : "Sending OTP"}
                >
                    Stop Server
                </Button>
                <Button
                    as="a"
                    href={HAPROXY_STATS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    colorScheme="purple"
                    leftIcon={<FiActivity />}
                    rightIcon={<FiExternalLink />}
                    ml={{ base: 0, sm: "auto" }}
                >
                    HAProxy Stats
                </Button>
            </Flex>

            {lastRun && (
                <Box
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={3}
                    bg="gray.50"
                >
                    <Flex align="center" gap={2} mb={2} wrap="wrap">
                        <Badge colorScheme={lastRun.action === "START" ? "green" : "red"}>
                            {lastRun.action}
                        </Badge>
                        <Text fontSize="sm" fontWeight="semibold">
                            {lastRun.status}
                        </Text>
                        <Text fontSize="xs" color="gray.500" ml="auto">
                            {new Date(lastRun.at).toLocaleString()}
                        </Text>
                    </Flex>
                    {lastRun.output && (
                        <Code
                            display="block"
                            whiteSpace="pre-wrap"
                            p={2}
                            borderRadius="md"
                            fontSize="xs"
                            maxH="200px"
                            overflowY="auto"
                        >
                            {lastRun.output}
                        </Code>
                    )}
                </Box>
            )}

            <Modal isOpen={isOpen} onClose={closeOtp} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Flex align="center" gap={2}>
                            <Icon as={FiLock} color="purple.500" />
                            Verify OTP to {otpAction?.toLowerCase()} server
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontSize="sm" color="gray.500" mb={3}>
                            An OTP was sent to your registered email/mobile. Enter it to
                            confirm{" "}
                            <b>
                                {otpAction === "STOP"
                                    ? "stopping (this disconnects all live devices)"
                                    : "starting"}
                            </b>{" "}
                            the erlang server.
                        </Text>
                        <FormControl>
                            <FormLabel fontSize="sm">OTP</FormLabel>
                            <Input
                                value={otp}
                                onChange={(e) =>
                                    setOtp(e.target.value.replace(/\D/g, ""))
                                }
                                placeholder="Enter OTP"
                                inputMode="numeric"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleVerifyAndExecute();
                                }}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter gap={2}>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleActionClick(otpAction as ServerAction)}
                            isLoading={generateOtp.isPending}
                            isDisabled={verifyOtp.isPending}
                        >
                            Resend OTP
                        </Button>
                        <Button size="sm" variant="outline" onClick={closeOtp}>
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            colorScheme={otpAction === "START" ? "green" : "red"}
                            onClick={handleVerifyAndExecute}
                            isLoading={verifyOtp.isPending}
                            loadingText="Verifying"
                        >
                            Verify &amp; {otpAction === "START" ? "Start" : "Stop"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};
