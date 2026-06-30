/** A device row from GET /v2/device/all-devices. */
export interface AllDevice {
    deviceId: string;
    name: string;
    imeiNo: number;
    simNo?: string;
    simServiceProvider?: string;
    divisionId?: string;
    divisionName?: string;

    // Server-connection flag from the all-devices response. The backend uses
    // `isDeviceConnected`; the other names are accepted defensively.
    isDeviceConnected?: boolean;
    connected?: boolean;
    isConnected?: boolean;
    online?: boolean;
    isOnline?: boolean;
    serverConnected?: boolean;
}

/** A predefined command from GET /v2/device-command. */
export interface CommandCatalogItem {
    id: number;
    title: string;
    command: string;
    reply?: string;
    description?: string;
    activeStatus?: boolean;
    custom?: boolean;
}

/** One element of the POST /v2/device-command/send-command array. */
export interface DeviceCommandEntity {
    device_imei: number;
    command: string;
    device_name: string;
    login_name: string;
    division_id: string;
}

/** Treat a device as connected to the server if any known flag is truthy. */
export function isDeviceConnected(device: AllDevice): boolean {
    return Boolean(
        device.isDeviceConnected ??
        device.connected ??
        device.isConnected ??
        device.online ??
        device.isOnline ??
        device.serverConnected
    );
}
