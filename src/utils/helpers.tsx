export const parseRetrievedNumber = (number: string): string => {
  const numberAsArray = number.split("");
  console.log({ numberAsArray });
  numberAsArray.splice(0, 1);
  numberAsArray.reverse();
  return numberAsArray.join("");
};

export const getDrawnDate = (locale: string, endTime: string) => {
  const endTimeInMs = parseInt(endTime, 10) * 1000;
  const endTimeAsDate = new Date(endTimeInMs);
  return endTimeAsDate.toLocaleDateString(locale, dateTimeOptions);
};

export const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export const timeOptions: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
};

export const dateTimeOptions: Intl.DateTimeFormatOptions = {
  ...dateOptions,
  ...timeOptions,
};
