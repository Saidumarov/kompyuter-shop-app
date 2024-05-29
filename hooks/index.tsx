export const NumberFormat = (value: number) => {
  return value?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
//
export const NumberFormatMonth = (value: number) => {
  return value
    ?.toFixed(0)
    ?.toString()
    ?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
