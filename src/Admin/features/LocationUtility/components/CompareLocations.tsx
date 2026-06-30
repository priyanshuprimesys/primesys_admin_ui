import DeviceMapPanel from "./DeviceMapPanel";

const CompareLocations = () => {
    return (
        <div className="flex gap-4">
            <div className="flex-1 border rounded-lg p-3 bg-white shadow-sm">
                <DeviceMapPanel label="Device A" />
            </div>
            <div className="flex-1 border rounded-lg p-3 bg-white shadow-sm">
                <DeviceMapPanel label="Device B" />
            </div>
        </div>
    );
};

export default CompareLocations;
