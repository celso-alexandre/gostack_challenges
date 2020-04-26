const formatDate = (date: Date): string => {
  const formattedDate = Intl.DateTimeFormat('pt-BR').format(date);

  return formattedDate;
};
export default formatDate;
