import { IntervalOperation, IntervalRelation } from "../model";
import { ALGEBRA_OPERATIONS } from "./algebra";
import { ARITHMETIC_OPERATIONS } from "./arithmetic";
import { MISC_OPERATIONS } from "./misc";
import { RELATIONAL_OPERATIONS } from "./relational";
import { TRIGONOMETRIC_OPERATIONS } from "./trigonometric";

export const OPERATORS: { [key: string]: IntervalOperation } = {
	...ARITHMETIC_OPERATIONS,
	...ALGEBRA_OPERATIONS,
	...MISC_OPERATIONS,
	...TRIGONOMETRIC_OPERATIONS,
};

export const RELATIONS: { [key: string]: IntervalRelation } = RELATIONAL_OPERATIONS;