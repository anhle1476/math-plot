import { IntervalOperation } from "../model";
import * as ia from "interval-arithmetic";

export const TRIGONOMETRIC_OPERATIONS: Record<string, IntervalOperation> = {    
    Sin: ia.sin,
    Cos: ia.cos,
    Tan: ia.tan,
    Arcsin: ia.asin,
    Arccos: ia.acos,
    Arctan: ia.atan,
    Sinh: ia.sinh,
    Cosh: ia.cosh,
    Tanh: ia.tanh,
}