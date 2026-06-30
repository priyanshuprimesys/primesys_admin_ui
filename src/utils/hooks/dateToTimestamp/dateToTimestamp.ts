export const dateToTimestamp = (date: string): number => {
  return new Date(date).getTime() / 1000;
};
