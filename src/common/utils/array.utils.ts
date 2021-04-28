 const isEmpty = function (items: any[]) {
  return items === [] || items.length === 0;
};

export const isNotEmpty = function (items: any[]) {
  return items !== [] || items.length !== 0;
};

export interface ArrayUtils<T> extends Array<T> {

}