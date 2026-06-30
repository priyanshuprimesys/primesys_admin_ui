import { useContext, useRef, useState } from "react";
import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    Icon,
    Badge,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
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

import { FiUploadCloud, FiCheckCircle, FiLock } from "react-icons/fi";
import { MdSimCard } from "react-icons/md";
import { toast } from "react-toastify";

import { UserDetailContext } from "../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import {
    useUploadSim,
    useGenerateOtp,
    useVerifyOtp,
} from "../data/queryOptions";
import { SimProvider, SimUploadResult, SIM_UPLOAD_ACCEPT } from "../data/schema";

interface LastUpload extends SimUploadResult {
    provider: SimProvider;
    fileName: string;
    at: number;
}

export const SimUploadSection = () => {
    const { userDetail } = useContext(UserDetailContext);
    const userName = userDetail?.data?.result?.userName || "";

    const uploadSim = useUploadSim();
    const generateOtp = useGenerateOtp();
    const verifyOtp = useVerifyOtp();

    // Track which provider is currently uploading so only that button spins.
    const [activeProvider, setActiveProvider] = useState<SimProvider | null>(null);
    // Result of the most recent successful upload, shown in an inline panel.
    const [lastUpload, setLastUpload] = useState<LastUpload | null>(null);
    // File awaiting OTP verification before it is uploaded.
    const [pending, setPending] = useState<{ provider: SimProvider; file: File } | null>(null);
    const [otp, setOtp] = useState("");
    const [sendingOtp, setSendingOtp] = useState<SimProvider | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const jioInputRef = useRef<HTMLInputElement>(null);
    const airtelInputRef = useRef<HTMLInputElement>(null);

    // Step 1 — a file was chosen; request an OTP, then open the verify dialog.
    const handleFile = (provider: SimProvider, file?: File) => {
        if (!file) return;
        if (!userName) {
            toast.error("User not loaded — cannot send OTP.");
            return;
        }
        setPending({ provider, file });
        setOtp("");
        setSendingOtp(provider);
        generateOtp.mutate(userName, {
            onSuccess: () => {
                toast.info("OTP sent to your registered email/mobile.");
                onOpen();
            },
            onError: (err) =>
                toast.error((err as Error)?.message || "Failed to send OTP"),
            onSettled: () => setSendingOtp(null),
        });
    };

    const closeOtp = () => {
        onClose();
        setPending(null);
        setOtp("");
    };

    // Step 3 — perform the upload once the OTP is verified.
    const upload = (provider: SimProvider, file: File) => {
        setActiveProvider(provider);
        uploadSim.mutate(
            { provider, file },
            {
                onSuccess: (result) => {
                    setLastUpload({
                        provider,
                        fileName: file.name,
                        at: Date.now(),
                        ...result,
                    });
                    toast.success(
                        `${provider} SIM upload complete — ${result.inserted} inserted, ${result.updated} updated.`
                    );
                },
                onError: (error) => {
                    toast.error(
                        (error as Error)?.message || `Failed to upload ${provider} SIM file`
                    );
                },
                onSettled: () => setActiveProvider(null),
            }
        );
    };

    // Step 2 — verify the OTP, then upload on success.
    const handleVerifyAndUpload = () => {
        if (!pending) return;
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
                    const { provider, file } = pending;
                    closeOtp();
                    upload(provider, file);
                },
                onError: (err) =>
                    toast.error((err as Error)?.message || "OTP verification failed"),
            }
        );
    };

    const isBusy = (provider: SimProvider) =>
        (uploadSim.isPending && activeProvider === provider) ||
        sendingOtp === provider;

    return (
        <Box>
            <Flex align="center" gap={2} mb={1}>
                <Icon as={MdSimCard} boxSize={6} color="teal.500" />
                <Heading size="md">SIM Upload</Heading>
            </Flex>
            <Text fontSize="sm" color="gray.500" mb={4}>
                Upload a provider SIM batch file (.csv, .xlsx, .xls). Rows are
                upserted on SIM number, so re-uploading the same file updates
                existing entries instead of creating duplicates.
            </Text>

            <Flex gap={3} wrap="wrap">
                <Button
                    colorScheme="red"
                    leftIcon={<FiUploadCloud />}
                    onClick={() => airtelInputRef.current?.click()}
                    isLoading={isBusy("airtel")}
                    isDisabled={uploadSim.isPending || sendingOtp !== null}
                    loadingText={sendingOtp === "airtel" ? "Sending OTP" : "Uploading Airtel"}
                >
                    Add Airtel File
                </Button>
                <Button
                    colorScheme="blue"
                    leftIcon={<FiUploadCloud />}
                    onClick={() => jioInputRef.current?.click()}
                    isLoading={isBusy("jio")}
                    isDisabled={uploadSim.isPending || sendingOtp !== null}
                    loadingText={sendingOtp === "jio" ? "Sending OTP" : "Uploading Jio"}
                >
                    Add Jio File
                </Button>
            </Flex>

            {/* Hidden inputs — value is reset on each change so re-selecting the
                same file still fires onChange. */}
            <input
                ref={airtelInputRef}
                type="file"
                accept={SIM_UPLOAD_ACCEPT}
                style={{ display: "none" }}
                onChange={(e) => {
                    handleFile("airtel", e.target.files?.[0]);
                    e.target.value = "";
                }}
            />
            <input
                ref={jioInputRef}
                type="file"
                accept={SIM_UPLOAD_ACCEPT}
                style={{ display: "none" }}
                onChange={(e) => {
                    handleFile("jio", e.target.files?.[0]);
                    e.target.value = "";
                }}
            />

            {lastUpload && (
                <Box
                    mt={5}
                    p={4}
                    borderWidth="1px"
                    borderColor="green.200"
                    bg="green.50"
                    borderRadius="lg"
                >
                    <Flex align="center" gap={2} mb={3} wrap="wrap">
                        <Icon as={FiCheckCircle} color="green.500" />
                        <Text fontWeight="semibold">Last upload</Text>
                        <Badge
                            colorScheme={lastUpload.provider === "airtel" ? "red" : "blue"}
                            borderRadius="md"
                        >
                            {lastUpload.provider}
                        </Badge>
                        <Text fontSize="sm" color="gray.600" noOfLines={1}>
                            {lastUpload.fileName}
                        </Text>
                        <Text fontSize="xs" color="gray.500" ml="auto">
                            {new Date(lastUpload.at).toLocaleString()}
                        </Text>
                    </Flex>
                    <StatGroup gap={8}>
                        <Stat>
                            <StatLabel color="gray.600">Inserted</StatLabel>
                            <StatNumber color="green.600">{lastUpload.inserted}</StatNumber>
                        </Stat>
                        <Stat>
                            <StatLabel color="gray.600">Updated</StatLabel>
                            <StatNumber color="blue.600">{lastUpload.updated}</StatNumber>
                        </Stat>
                    </StatGroup>
                </Box>
            )}

            <Modal isOpen={isOpen} onClose={closeOtp} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Flex align="center" gap={2}>
                            <Icon as={FiLock} color="teal.500" />
                            Verify OTP to upload {pending?.provider} SIM file
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontSize="sm" color="gray.500" mb={3}>
                            An OTP was sent to your registered email/mobile. Enter it to
                            upload <b>{pending?.file.name}</b>.
                        </Text>
                        <FormControl>
                            <FormLabel fontSize="sm">OTP</FormLabel>
                            <Input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                placeholder="Enter OTP"
                                inputMode="numeric"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleVerifyAndUpload();
                                }}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter gap={2}>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                                pending && handleFile(pending.provider, pending.file)
                            }
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
                            colorScheme="teal"
                            leftIcon={<FiUploadCloud />}
                            onClick={handleVerifyAndUpload}
                            isLoading={verifyOtp.isPending}
                            loadingText="Verifying"
                        >
                            Verify &amp; Upload
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};
