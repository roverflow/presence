export const calculateHrsWorked = (
  inTime: string,
  outTime: string,
  breakTime: string
) => {
  const [inHours, inMinutes] = inTime.split(":").map(Number);
  const [outHours, outMinutes] = outTime.split(":").map(Number);
  const [breakHours, breakMinutes] = breakTime.split(":").map(Number);
  const inDate = new Date(0, 0, 0, inHours, inMinutes);
  const outDate = new Date(0, 0, 0, outHours, outMinutes);
  const breakDuration = breakHours + breakMinutes / 60;
  const diff = (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60);
  const final = diff - breakDuration;
  return final;
};
