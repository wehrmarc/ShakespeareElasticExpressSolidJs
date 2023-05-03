import { Response, Request } from "express"
//import { ITest } from "../../types/types";
//import Test from "./../../models/test;

function getTest(req: Request, res: Response) {
	const test: any = {
		name: "test number1",
		description: "first test",
		status: true
	};
	
	res.status(200).json({ test })
}

export { getTest }