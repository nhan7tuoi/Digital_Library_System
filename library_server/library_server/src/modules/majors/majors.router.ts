import { Router } from "express";
import Container from "typedi";
import { MajorsConatroller } from "./majors.controller";

const majorsRouter = Router();
const majorsController = Container.get(MajorsConatroller);

majorsRouter.get("/majors", majorsController._getListMajors);
majorsRouter.post("/majors", majorsController._createMajors);

export default majorsRouter;
