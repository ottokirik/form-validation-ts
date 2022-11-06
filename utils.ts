export const exists = <TEntity>(x: TEntity): boolean => Boolean(x);
export const contains = (value: string, pattern: RegExp): boolean => value.search(pattern) >= 0;
export const inRange = (value: Comparable, min: Comparable, max: Comparable): boolean => value >= min && value <= max;

export const yearsOf = (date: TimeStamp): NumberYears => new Date().getFullYear() - new Date(date).getFullYear();
