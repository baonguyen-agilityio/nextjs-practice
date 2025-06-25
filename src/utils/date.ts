export const formatDate = (input: string): string => {
  const date = new Date(input);
  if (isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
