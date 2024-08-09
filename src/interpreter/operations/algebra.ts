import * as ia from "interval-arithmetic";
import { IntervalOperation } from "../model";

function square(value: ia.Interval): ia.Interval {
	return ia.pow(value, 2);
}

export const ALGEBRA_OPERATIONS: Record<string, IntervalOperation> = {
	Mod: ia.fmod,
	Power: ia.pow,
	Root: ia.nthRoot,
	Sqrt: ia.sqrt,
	Square: square,
};
