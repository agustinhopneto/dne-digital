export const formatDate = (date: string): string => {
  const formattedDate = [date.slice(6, 8), date.slice(4, 6), date.slice(0, 4)];

  return formattedDate.join('/');
};
