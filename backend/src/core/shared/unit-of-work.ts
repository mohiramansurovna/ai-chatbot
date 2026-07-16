import { unknown } from "zod";

export type Tx=unknown
export interface IUnitOfWork {
    run<T>(fn: (tx: Tx) => Promise<T>): Promise<T>;
}
export const UNIT_OF_WORK = Symbol("UNIT_OF_WORK")