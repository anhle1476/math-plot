import { IntervalRelation } from "../model";
import * as ia from "interval-arithmetic";

export const RELATIONAL_OPERATIONS: Record<string, IntervalRelation> = {
	Equal: ia.equal,
	Greater: ia.greaterThan,
	GreaterEqual: ia.greaterEqualThan,
	Less: ia.lessThan,
	LessEqual: ia.lessEqualThan,
	NotEqual: ia.notEqual,
};
