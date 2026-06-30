import { lazy } from "react";

const IOTDataModule = lazy(()=> import('../../features/IOTData/index'));

export {IOTDataModule};