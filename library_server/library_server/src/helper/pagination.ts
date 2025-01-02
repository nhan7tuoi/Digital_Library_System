import { Request } from "express";

export class Pagination {
  total: number;
  page: number;
  limit: number;
  constructor(page: number, limit: number, total?: number) {
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
  getOffset = () => {
    return (this.page - 1) * this.limit;
  };

  static fromRequestBody(req: Request) {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 50;
    return new Pagination(page, limit);
  }
  static fromRequestQuery(req: Request) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    return new Pagination(page, limit);
  }
}
