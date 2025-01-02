import { Service } from "typedi";
import Majors from "./model/majors.model";

@Service()
export class MajorsService {
  async getListMajors() {
    return await Majors.find();
  }

  async createMajors(params: any) {
    const { name } = params;
    const majors = await Majors.create({
      name,
    });
    return majors;
  }

  async getMajorsByKeyword(keyword: string) {
    return await Majors.find(
      { name: { $regex: keyword, $options: "i" } },
      { _id: 1 }
    );
  }
}
