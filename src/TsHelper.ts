export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export type SetValuesPayload<T> = Partial<
  Omit<T, FunctionPropertyNames<T> | "_id">
>;
