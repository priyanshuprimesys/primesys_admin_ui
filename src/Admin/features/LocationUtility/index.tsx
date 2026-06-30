import { useState } from "react";
import LocationTracker from "./components/LocationTracker";
import CompareLocations from "./components/CompareLocations";
import BulkLocationChange from "./modules/bulk_location_change";

const TABS = ["Location Tracker", "Compare Locations", "Bulk Location Change"] as const;

const LocationUtility = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="flex border-b border-gray-300 mb-4">
                {TABS.map((label, i) => (
                    <button
                        key={label}
                        onClick={() => setActiveTab(i)}
                        className={`px-5 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === i
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
            {activeTab === 0 && <LocationTracker />}
            {activeTab === 1 && <CompareLocations />}
            {activeTab === 2 && <BulkLocationChange />}
        </div>
    );
};

export default LocationUtility;
