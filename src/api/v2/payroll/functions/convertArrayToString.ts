export function convertArrayToString<T>(items: T[]) {
  if (items.length > 1) {
    return items.reduce((a, b, i) => {
      if (i !== 0) {
        return a + " + " + b;
      }
      return a + b;
    }, '');
  }
  return items[0];
}
