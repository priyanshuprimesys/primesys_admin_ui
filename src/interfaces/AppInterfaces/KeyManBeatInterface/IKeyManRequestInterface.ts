


export interface IKeyManRequestInterface {
	deviceImei: number,
	divisionId: string,
	deviceName: string,
	deviceNo: number,
	updatedBy: string,
	updatedAt: Date | null,
	sectionName: string,
	beatId: string,
	activeStatus: boolean,
	startTime: string,
	endTime: string,
	bstartTime: string,
	bendTime: string,
	tstartKm: number,
	tendKm: number,
	deviceTypeId: number,
	isMultipleBeatPath: boolean,
	tripNo: number;
}
export interface IKeyManFormikRequestInterface {
	deviceImei: string,
	divisionId: string,
	deviceName: string,
	deviceNo: string,
	updatedBy: string,
	updatedAt: string,
	sectionName: string,
	beatId: string,
	activeStatus: boolean,
	startTime: string,
	endTime: string,
	bstartTime: string,
	bendTime: string,
	tstartKm: string,
	tendKm: string,
	deviceTypeId: string,
	isMultipleBeatPath: boolean
	tripNo: string;
	sendAutoPeriodCommand:boolean;
	shiftType:number;
	reportEnable:boolean;
}





export interface IKeymanSingleFileBeat {
	"deviceImei": string,
	"divisionId": string,
	"deviceName": string,
	"deviceNo": string,
	"updatedBy": string,
	"updatedAt": string,
	"sectionName": string,
	"beatId": string,
	"activeStatus": boolean,
	"startTime": string,
	"endTime": string,
	"bstartTime": string,
	"bendTime": string,
	"tstartKm": string,
	"tendKm": string,
	"deviceTypeId": string,
	"sendAutoPeriodCommand": boolean
}






export interface IKeyManFormikBulkRequestInterface {
	file: any;
	beat: IKeymanSingleFileBeat;
}





export interface IKeymanFormikEditInterface {
	sectionName: string,
	beatId: string,
	activeStatus: boolean,
	startTime: string,
	endTime: string,
	deviceImei: string,
	deviceTypeId: string,
	shiftType: number,
	deviceNo: string,
	tstartKm: string,
	tendKm: string,
	bendTime: string,
	bstartTime: string,
	updatedBy: string,
	updatedAt: string,
	divisionId: string,
	deviceName: string,
	tripNo: string;
	isMultipleBeatPath: true,
	reportEnable:boolean
}






export interface IKeymanSingleBeatDeleteInterface {
	beatId: string;
	updatedBy: string
}