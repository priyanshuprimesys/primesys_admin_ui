import {
  IKeyManFormikRequestInterface,
  IKeyManRequestInterface,
  IKeymanSingleBeatDeleteInterface,
} from "../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManRequestInterface";
import { IKeymanBeatDataTableInterface } from "../../../interfaces/AppInterfaces/KeyManBeatInterface/KeymanBeatDataTableInterface";

export const KeyManInitialState: IKeyManRequestInterface = {
  deviceImei: 0,
  divisionId: "",
  deviceName: "",
  deviceNo: 0,
  updatedBy: "",
  updatedAt: null,
  sectionName: "",
  beatId: "",
  activeStatus: false,
  startTime: "",
  endTime: "",
  bstartTime: "",
  bendTime: "",
  tstartKm: 0,
  tendKm: 0,
  deviceTypeId: 0,
  isMultipleBeatPath: false,
  tripNo: 0,
};
export const KeyManFormikInitialState: IKeyManFormikRequestInterface = {
  deviceImei: "",
  divisionId: "",
  deviceName: "",
  deviceNo: "",
  updatedBy: "",
  updatedAt: "",
  sectionName: "",
  beatId: "",
  activeStatus: false,
  startTime: "",
  endTime: "",
  bstartTime: "",
  bendTime: "",
  tstartKm: "",
  tendKm: "",
  deviceTypeId: "",
  isMultipleBeatPath: false,
  tripNo: "",
  sendAutoPeriodCommand: false,
  shiftType: 0,
  reportEnable: false
};

export const KeymanBeatTableInitialState: IKeymanBeatDataTableInterface = {
  sectionName: "",
  beatId: "",
  activeStatus: false,
  startTime: 0,
  endTime: 0,
  deviceImei: 0,
  deviceTypeId: 0,
  shiftType: 0,
  tendKm: 0,
  bendTime: 0,
  tstartKm: 0,
  bstartTime: 0,
  deviceName: "",
  deviceNo: 0,
};

export const KeymanSingleBeatDeleteInitialState: IKeymanSingleBeatDeleteInterface =
  {
    beatId: "",
    updatedBy: "",
  };
