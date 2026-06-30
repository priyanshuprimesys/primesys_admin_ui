export const getBatteryPercentCalucate = (batteryLevel: number | string | undefined): number | string => {
    if(batteryLevel)
    {
        let level: number;
        level = typeof batteryLevel === 'string' ? parseFloat(batteryLevel) : batteryLevel;
        if (batteryLevel === 'data_not_found') {
          return 0;
        }
        const value: number = (level / 6) * 100;
        return `${Math.floor(value)}%`;
    }
    return `0%`;
 
  }

export const getSignalPercentCalculate = (signalStrength: number | string | undefined): number | string => {
    if(signalStrength)
    {
        let signal: number;
        signal = typeof signalStrength === 'string' ? parseFloat(signalStrength) : signalStrength;
        if (signalStrength === 'data_not_found') {
          return 0;
        }
        const value: number = (signal / 4) * 100;
        return `${Math.floor(value)}%`;
    }
    return `0%`
  }