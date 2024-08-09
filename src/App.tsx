/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import functionPlot from "function-plot";
import { convertLatexToAsciiMath, MathfieldElement } from "mathlive";
import { useEffect, useRef, useState } from "react";
import { ComputeEngine } from "@cortex-js/compute-engine";
import "//unpkg.com/mathlive";
import { evalMathJSON } from "./interpreter";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"math-field": React.DetailedHTMLProps<
				React.HTMLAttributes<MathfieldElement>,
				MathfieldElement
			>;
		}
	}
}

function App() {
	const ref = useRef<HTMLDivElement>(null);
	const [sampler, setSampler] = useState<"interval" | "builtIn">("interval");
	const [value, setValue] = useState<string>("x*2");
	const [asciiMathValue, setAsciiMathValue] = useState<string>("x*2");
	const [compiledFn, setCompiledFn] = useState<{
		func: ((args: Record<string, any>) => any | undefined) | undefined;
	}>({
		func: undefined,
	});

	const mf = useRef<MathfieldElement>(null);

	// Customize the mathfield when it is created
	useEffect(() => {
		if (mf.current) {
			// @ts-expect-error expected
			MathfieldElement.computeEngine = new ComputeEngine();

			mf.current.mathVirtualKeyboardPolicy = "manual";
			mf.current.addEventListener("focusin", () =>
				window.mathVirtualKeyboard.show()
			);
			mf.current.addEventListener("focusout", () =>
				window.mathVirtualKeyboard.hide()
			);
		}
	}, [mf]);

	useEffect(() => {
		if (!ref.current) return;

		const evaluator = compiledFn.func ? compiledFn.func : asciiMathValue;
		try {
			functionPlot({
				target: "#app",
				yAxis: { domain: [-1, 9] },
				grid: true,
				tip: {
					xLine: true, // dashed line parallel to y = 0
					yLine: true, // dashed line parallel to x = 0
				},
				data: [
					{
						fn: evaluator,
						sampler: sampler === "interval" ? "interval" : "builtIn",
						graphType: sampler === "interval" ? "interval" : "polyline",
						fnType: sampler === "interval" ? "implicit" : undefined,
					},
				],
			});
		} catch (error) {
			console.error(error);
		}
	}, [ref, asciiMathValue, compiledFn, sampler]);

	const setMfValue = () => {
		const value = mf.current!.getValue();
		setValue(value);
		setAsciiMathValue(convertLatexToAsciiMath(value));

		try {
			const expr = mf.current!.expression;

			if (sampler === "interval") {
				const mathJson = JSON.stringify(expr);
				console.clear();
				console.log(mathJson, undefined, 2);
				setCompiledFn({
					func: (scope = {}) => {
						try {
							return evalMathJSON(mathJson, scope);
						} catch (error) {
							console.error(error);
							return undefined;
						}
					},
				});
				return;
			} else {
				const fn = expr.compile();
				if (fn) {
					const wrapper = (scope = {}) => {
						try {
							return fn!(scope);
						} catch (error) {
							console.error(error);
							return undefined;
						}
					};
					setCompiledFn({
						func: wrapper,
					});
					return;
				}
			}
			setCompiledFn({
				func: undefined,
			});
		} catch (error) {
			setCompiledFn({
				func: undefined,
			});
			console.warn("compile failed", error);
		}
	};

	return (
		<>
			<div>
				<math-field
					style={{ display: "block" }}
					ref={mf}
					onInput={() => setMfValue()}
				>
					{value}
				</math-field>
				<p>
					<strong>Latex:</strong> {value}
				</p>
				<p>
					<strong>ASII Math:</strong> {asciiMathValue}
				</p>
			</div>
			<div ref={ref} id="app"></div>
		</>
	);
}

export default App;
