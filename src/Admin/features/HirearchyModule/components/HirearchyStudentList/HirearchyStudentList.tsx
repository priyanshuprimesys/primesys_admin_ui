import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "../../../../../global/styles/GlobalCss.css";
import FilterButton from "../Button/FilterButton";
import ButtonBounce from "../../../../../global/components/button/ButtonBounce";
import { IconComponents } from "../../../../../global/Icons/IconsStore";
import TextInputRef from "../TextInput/TextInputRef";
import { HirearchyFormModuleContext } from "../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyFormModuleContext/HirearchyFormModuleContext";
import { Button } from "@chakra-ui/react";
import CustomModal from "../../../../../global/components/CustomModal/CustomModal";

interface HirearchyStudentProps {
  data: any[] | undefined;
  isLoading?: boolean;
  isSuccess?: boolean;
}

const HirearchyStudentList: React.FC<HirearchyStudentProps> = ({
  data,
  isLoading,
}) => {
  const minimumStudentId = useRef<HTMLInputElement | null>(null);
  const maximumStudentId = useRef<HTMLInputElement | null>(null);
  const deviceNameId = useRef<HTMLInputElement | null>(null);
  const [filterData, setFilterData] = useState<any[]>([]);
  const [devicesNotFound, setDevicesNotFound] = useState<Array<any>>([]);
  const checkActive = useRef<boolean>(false);
  const [onOpenModal, setOnOpenModal] = useState<boolean>(false);

  const studentListRef = useRef<string[]>([]);

  const { hirearchyStudentListRef } = useContext(HirearchyFormModuleContext);
  const { hirearchyDepartmentParentId } = useContext(
    HirearchyFormModuleContext
  );

  const updateStudentData = useCallback(() => {
    const filterDataResult = data
      ? data?.map((student) => ({
          ...student,
          isChecked: false,
        }))
      : [];

    setFilterData(filterDataResult);
  }, [data]);

  useEffect(() => {
    if (data) {
      updateStudentData();
    }
  }, [data]);

  // useEffect(() => {
  //   let dataFilter;
  //   if (searchStudent) {
  //     dataFilter = data?.filter((x) => x.deviceNo == parseInt(searchStudent));
  //     setFilterData(dataFilter);
  //   }
  //   else {
  //     setFilterData(data);
  //   }
  // }, [searchStudent]);

  const onHandleFilter = () => {
    const minimumId = minimumStudentId.current?.value ?? "";
    const maximumId = maximumStudentId.current?.value ?? "";
    const minId = parseInt(minimumId, 10);
    const maxId = parseInt(maximumId, 10);

    if (data) {
      let dataFilter;
      if (isNaN(minId) && isNaN(maxId)) {
        const checkedFilteredData = data.map((user) =>
          studentListRef.current.includes(user.deviceNo)
            ? { ...user, isChecked: true }
            : user
        );
        setFilterData(checkedFilteredData);

        if (minimumStudentId.current) {
          minimumStudentId.current.value = "";
        }

        if (maximumStudentId.current) {
          maximumStudentId.current.value = "";
        }

        return alert("Please input a number");
      } else {
        if (minId > maxId) {
          alert("minimum id should not be greater than maximum Id");
          return;
        }

        if (!isNaN(minId) && isNaN(maxId)) {
          dataFilter = data?.filter((x) => x.deviceNo >= minId);
        } else if (isNaN(minId) && !isNaN(maxId)) {
          dataFilter = data?.filter((x) => x.deviceNo <= maxId);
        } else if (minimumStudentId && maximumStudentId) {
          dataFilter = data?.filter(
            (x) => x.deviceNo >= minId && x.deviceNo <= maxId
          );
        }
        if (dataFilter) {
          const filterStudentDataFilter = dataFilter.map((user) =>
            studentListRef.current.includes(user.deviceNo)
              ? { ...user, isChecked: true }
              : user
          );

          if (minimumStudentId.current) {
            minimumStudentId.current.value = "";
          }

          if (maximumStudentId.current) {
            maximumStudentId.current.value = "";
          }

          setFilterData(filterStudentDataFilter);
        }
      }
    }
  };

  const onSelectOptionAll = () => {
    checkActive.current = !checkActive.current;

    const selectAllData = filterData?.map((device) => ({
      ...device,
      isChecked: checkActive.current,
    }));

    const selectedIds = selectAllData.map((x) => {
      if (x.isChecked) {
        return x.deviceNo;
      }
    });
    studentListRef.current = selectedIds;
    if (checkActive.current) {
      hirearchyStudentListRef.current = selectedIds.join(",");
    } else if (!checkActive.current) {
      hirearchyStudentListRef.current = "";
    }

    setFilterData(selectAllData);
  };

  const handleStudentChecked = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = e.target;

    if (checked) {
      studentListRef.current.push(name);
    } else {
      studentListRef.current = studentListRef.current.filter(
        (device) => device !== name
      );
    }
    const sortedArrayStudentList = studentListRef.current.sort(
      (a, b) => Number(a) - Number(b)
    );

    hirearchyStudentListRef.current = sortedArrayStudentList.join(",");

    const studentDetail = filterData.map((user) =>
      user.deviceNo == name ? { ...user, isChecked: checked } : user
    );
    setFilterData(studentDetail);
  };

  const onSelectDevice = () => {
    const deviceNumberString =
      deviceNameId.current?.value.slice(0, -1).split(",").map(Number) ?? [];

    const isNumberInteger = deviceNumberString?.some(
      (x) => Number.isInteger(x) === false
    );

    const notFoundNumbers = deviceNumberString.filter(
      (num) => !filterData.some((item) => item.deviceNo === num)
    );

    if (notFoundNumbers.length > 0) {
      setDevicesNotFound(notFoundNumbers);
      setOnOpenModal(true);
      return;
    }

    if (isNumberInteger === true) {
      alert("Please check selected number it contains a decimal");
      return;
    }

    const updatedData = filterData.map((device) => ({
      ...device,
      isChecked:
        device.isChecked || deviceNumberString?.includes(device.deviceNo),
    }));

    if (deviceNumberString) {
      const combinedList = [...deviceNumberString, studentListRef.current];
      hirearchyStudentListRef.current = combinedList?.join(",");
    }

    if (deviceNameId.current) {
      deviceNameId.current.value = "";
    }
    setFilterData(updatedData);
  };

  return (
    <>
      <div>
        <div className="px-1 py-2 border-t-2 border-gray-500">
          <div>
            <div className="flex items-end gap-2">
              <TextInputRef
                Type="number"
                inputRef={minimumStudentId}
                placeHolder="Minimum Id"
                labelName="Minimum Id"
                padding="px-2 py-2"
                width="w-24"
              />
              <TextInputRef
                Type="number"
                inputRef={maximumStudentId}
                placeHolder="Maximum Id"
                labelName="Maximum Id"
                padding="px-2 py-2"
                width="w-24"
              />

              <FilterButton onHandleClick={onHandleFilter} />

              <ButtonBounce
                disabled={hirearchyDepartmentParentId == "" ? true : false}
                onHandleButtonClick={onSelectOptionAll}
                selectedState={checkActive.current}
                icon={[IconComponents.selectedBox, IconComponents.emptyBox]}
              />

              <TextInputRef
                Type="string"
                inputRef={deviceNameId}
                placeHolder="Enter device Number"
                labelName="Device Numbers"
                padding="px-2 py-2"
                width="w-full"
              />
              <Button onClick={onSelectDevice}>Select</Button>
            </div>
          </div>
          <div>
            <p className="m-0 mt-2 text-base font-semibold">Student List:</p>
          </div>
          <div className="max-w-2xl px-1 my-2 overflow-hidden border-2 border-gray-700 rounded dataScroll max-h-48">
            <div className="flex flex-wrap w-full gap-4 px-1 py-2 text-justify ">
              {isLoading ? (
                <p className="m-0 font-semibold text-center">Loading....</p>
              ) : data ? (
                filterData?.map((item, index) => (
                  <div key={index} className="flex gap-1">
                    <input
                      type="checkbox"
                      id={item.deviceId}
                      disabled={false}
                      className="cursor-pointer"
                      name={item.deviceNo}
                      checked={item.isChecked || false}
                      onChange={handleStudentChecked}
                    />
                    <span>{item.deviceNo}</span>
                  </div>
                ))
              ) : (
                <span>No Student Available</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {onOpenModal && (
        <CustomModal
          modalHeader="Devices not found"
          setModalActive={setOnOpenModal}
        >
          <h1>These devices are not found in the Student list</h1>
          <div className="  w-full">
            <p className="break-all  whitespace-normal overflow-auto">
              {devicesNotFound.join(",")}
            </p>
          </div>
        </CustomModal>
      )}
    </>
  );
};

export default HirearchyStudentList;
