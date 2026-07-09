export interface IUnitOfWork {
    run<T>(fn: (tx: unknown) => Promise<T>): Promise<T>;
}
export const UNIT_OF_WORK = Symbol("UNIT_OF_WORK")