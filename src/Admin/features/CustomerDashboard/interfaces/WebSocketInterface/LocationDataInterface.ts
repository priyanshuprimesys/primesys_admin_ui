export interface ILocationDataInterface{
    gsm_signal_strength: number | string;
    lan: number;
    lan_direction: string;
    lat: number;
    lat_direction: string;
    speed: number;
    voltage_level: number | string;
    timestamp: number;
    nearest_rdps :  number | string;
    rdps_dist_diff:  number | string;
}