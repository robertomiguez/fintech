export const camelCaseToReadable = (camelCaseString: string) => {
  return camelCaseString
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
};
