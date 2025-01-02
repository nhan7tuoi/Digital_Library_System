import { Inject, Service } from "typedi";
import { BookService } from "./book.service";
import { NextFunction, Request, Response } from "express";
import { ResponseCustom } from "../../helper/response";
import { saveFile } from "../../aws/aws.helper";
import { Pagination } from "../../helper/pagination";

@Service()
export class BookController {
  constructor(@Inject() private bookservice: BookService) {}

  getBookContentByPage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookId = req.query.bookId;
      const page = Number(req.query.page);
      const result = await this.bookservice.getBookContentByPage({
        bookId,
        page,
      });
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };
  getBookByMajorsUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.body.userId;
      const { books, pagination } =
        await this.bookservice.getBookByMajorsUserId(
          userId,
          Pagination.fromRequestQuery(req)
        );
      res.send(new ResponseCustom(books, null, pagination));
    } catch (error) {
      next(error);
    }
  };

  getTopRatedBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.bookservice.getTopRatedBooks();
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  getTopViewedBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.bookservice.getTopViewedBooks();
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  getRecommendBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { books, pagination } = await this.bookservice.getRecommendBooks(
        req.body.userId,
        Pagination.fromRequestQuery(req)
      );
      res.send(new ResponseCustom(books, null, pagination));
    } catch (error) {
      next(error);
    }
  };

  addbook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imageFile = req.files["image"][0];
      const pdfFile = req.files["pdf"][0];
      console.log(imageFile);
      console.log(pdfFile);
      const pdfLink = await saveFile(pdfFile);
      const imageLink = await saveFile(imageFile);
      req.body.image = imageLink;
      req.body.pdfLink = pdfLink;
      const result = await this.bookservice.addBook(req.body);
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  getSummaryByBookId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.bookservice.getSummaryByBookId(
        req.query.bookId as string
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  createSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.bookservice.createSummary(req.body);
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  getBookDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.bookservice.getBookDetails(
        req.query.bookId as string
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  findBookByKeyword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { books, pagination } = await this.bookservice.findBooksByKeyword(
        req.body.keyword,
        Pagination.fromRequestBody(req)
      );
      res.send(new ResponseCustom(books, null, pagination));
    } catch (error) {
      next(error);
    }
  };

  deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.bookservice.deleteBook(req.params.bookId);
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imageFile = req.file;
      console.log(imageFile);
      if (imageFile) {
        const imageLink = await saveFile(imageFile);
        req.body.image = imageLink;
      }
      const result = await this.bookservice.updateBook(req.body);
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };
  getBooksByGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { books, pagination } = await this.bookservice.getBooksByGenre(
        req.query.genreId as string,
        Pagination.fromRequestQuery(req)
      );
      res.send(new ResponseCustom(books, null, pagination));
    } catch (error) {
      next(error);
    }
  };
}
