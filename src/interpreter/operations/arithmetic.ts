import { IntervalOperation } from "../model";
import * as ia from "interval-arithmetic";

export const ARITHMETIC_OPERATIONS: Record<string, IntervalOperation> = {
    Add: ia.add,
    Subtract: ia.subtract,
    Multiply: ia.multiply,
    Divide: ia.divide,
    Negate: ia.negative,
};
