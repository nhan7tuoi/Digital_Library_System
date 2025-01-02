import { Router } from "express";
import Container from "typedi";
import { AuthMiddleware } from "../auth/auth.middleware";
import { BookController } from "./book.controller";
import { Role } from "../user/types/user.type";
import { BookMiddleware } from "./book.middleware";
import { BookCreateReqDTO, BookUpdateReqDTO } from "./dto/book.dto";
import { upload } from "../../aws/aws.helper";

const bookRouter = Router();
const authMiddleware = Container.get(AuthMiddleware);
const bookController = Container.get(BookController);
const bookMiddleware = new BookMiddleware();

bookRouter.get(
  "/book/get-content",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  bookController.getBookContentByPage
);

bookRouter.get(
  "/book/get-by-majors-user",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  bookController.getBookByMajorsUserId
);

bookRouter.get(
  "/book/get-top-rated",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  bookController.getTopRatedBooks
);

bookRouter.get(
  "/book/get-top-viewed",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  bookController.getTopViewedBooks
);
bookRouter.get(
  "/book/recommend-books",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  bookController.getRecommendBooks
);
bookRouter.post(
  "/books/add-book",
  authMiddleware.authenticateAccessToken([Role.Admin]),
  upload.fields([{ name: "image" }, { name: "pdf" }]),
  bookMiddleware.validate(BookCreateReqDTO),
  bookController.addbook
);

bookRouter.post(
  "/books/create-summary",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  bookController.createSummary
);

bookRouter.get(
  "/books/book-details",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  bookController.getBookDetails
);

bookRouter.post(
  "/books/find-books",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  bookController.findBookByKeyword
);

bookRouter.post(
  "/books/update-book",
  authMiddleware.authenticateAccessToken([Role.Admin]),
  upload.single("image"),
  bookMiddleware.validate(BookUpdateReqDTO),
  bookController.updateBook
);

bookRouter.delete(
  "/books/:bookId",
  authMiddleware.authenticateAccessToken([Role.Admin]),
  bookController.deleteBook
);
bookRouter.get(
  "/books/get-by-genre",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  bookController.getBooksByGenre
);
export default bookRouter;
