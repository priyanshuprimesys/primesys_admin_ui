import { Badge } from "@chakra-ui/react";
import ChakraUiModal from "../../../../global/components/Modals/components/ChakraUiModal";
import { dateTimeUtil } from "../../../../utils/dateTimeUtils/DateTimeUtil";
import { DeviceLocation } from "../data/schema";


type Props = {
    isOpen: boolean;
    onClose: () => void;
    locations: DeviceLocation[];
}




const LocationModal = ({ locations, isOpen, onClose }: Props) => {
    return (
        <ChakraUiModal isOpen={isOpen} onClose={onClose} modalHeader="Locations">
            <div className={`overflow-auto ${locations.length == 0 ? "" : "max-h-[450px]"}`}>
                {
                    locations.length == 0 ?
                        <div>
                            <Badge variant={'solid'} backgroundColor={"red"}>
                                Not Locations found
                            </Badge>
                        </div>
                        :
                        locations.map((location, index) => (
                            <div key={index} className="shadow-gray-600 py-2 px-2 flex flex-col gap-2 border-2 rounded-md my-2 shadow-md">
                                <div className="flex items-center justify-between">
                                    <div><span className="font-bold">Feature:</span>{location.featureDetail}</div>
                                    <div>Blind: {location.isBlind ? 'True' : 'False'}</div>
                                </div>
                                <div>
                                    <div>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <span className="font-bold">Lat: </span>
                                                <span>{location.lat.toFixed(7)}</span>
                                            </div>
                                            <div>-</div>
                                            <div>
                                                <span className="font-bold">Lon: </span>
                                                <span>{location.lon.toFixed(7)}</span>
                                            </div>
                                        </div>
                                        <div>{dateTimeUtil.formatToDateTime(location.timestamp)}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                }
            </div>

        </ChakraUiModal>

    )
}

export default LocationModal;