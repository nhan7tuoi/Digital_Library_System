import { Router } from "express";
import Container from "typedi";
import { AuthMiddleware } from "../auth/auth.middleware";
import { NoteMiddleware } from "./note.middleware";
import { NoteController } from "./note.controller";
import { Role } from "../user/types/user.type";
import { NoteCreateReqDTO, NoteUpdateReqDTO } from "./dto/note.dto";

const noteRouter = Router();
const authMiddleware = Container.get(AuthMiddleware);
const noteMiddleware = new NoteMiddleware();
const noteController = Container.get(NoteController);

noteRouter.post(
  "/note",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  noteMiddleware.validate(NoteCreateReqDTO),
  noteController.createNote
);

noteRouter.get(
  "/notes",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  noteController.getNotesByBookId
);

noteRouter.put(
  "/note",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  noteMiddleware.validate(NoteUpdateReqDTO),
  noteController.updateNote
);

noteRouter.delete(
  "/note/:noteId",
  authMiddleware.authenticateAccessToken([Role.Admin, Role.User]),
  noteController.deleteNote
);
export default noteRouter;
