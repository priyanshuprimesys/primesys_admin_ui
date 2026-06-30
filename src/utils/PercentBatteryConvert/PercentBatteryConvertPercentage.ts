export const getBatteryPercentCalucate = (batteryLevel: number | string): number | string => {
  let level: number;
  level = typeof batteryLevel === 'string' ? parseFloat(batteryLevel) : batteryLevel;
  if (batteryLevel === 'data_not_found') {
    return 0;
  }
  const value: number = (level / 6) * 100;
  return `${Math.floor(value)}%`;
}

export const getSignalCalculate = (signalStrength: number | string): number | string => {
  let signal: number;
  signal = typeof signalStrength === 'string' ? parseFloat(signalStrength) : signalStrength;
  if (signalStrength === 'data_not_found') {
    return 0;
  }
  const value: number = (signal / 4) * 100;
  return `${Math.floor(value)}%`;
}