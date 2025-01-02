import { BookService } from "./../book/book.service";
import { Inject, Service } from "typedi";
import { NoteCreateReqDTO, NoteUpdateReqDTO } from "./dto/note.dto";
import Note from "./model/note.model";
import mongoose from "mongoose";
import { Errors } from "../../helper/error";

@Service()
export class NoteService {
  constructor(@Inject() private bookService: BookService) {}

  createNote = async (params: NoteCreateReqDTO) => {
    const { bookId, userId, content, page } = params;
    await this.bookService.checkPublishedBook(bookId);
    const note = new Note({
      page: page,
      content: content,
      user: new mongoose.Types.ObjectId(userId),
      book: new mongoose.Types.ObjectId(bookId),
    });
    await note.save();
    return note;
  };

  getNotesByBookId = async (userId: string, bookId: string) => {
    const notes = await Note.find({ user: userId, book: bookId });
    return notes;
  };

  getNoteById = async (noteId: string) => {
    return await Note.findOne({
      _id: new mongoose.Types.ObjectId(noteId),
    });
  };

  checkExistedNote = async (noteId: string) => {
    const note = await this.getNoteById(noteId);
    if (!note) throw Errors.noteNotExits;
    return note;
  };

  deleteNote = async (userId: string, noteId: string) => {
    const note = await this.checkExistedNote(noteId);
    if (userId != note.user.toString()) throw Errors.forbidden;
    await Note.deleteOne({ _id: note._id });
    return true;
  };

  updateNote = async (params: NoteUpdateReqDTO) => {
    const { bookId, content, userId, noteId } = params;
    await this.bookService.checkPublishedBook(bookId);
    const note = await this.checkExistedNote(noteId);
    if (userId != note.user.toString()) throw Errors.forbidden;
    await Note.updateOne(
      { _id: new mongoose.Types.ObjectId(noteId) },
      { content: content }
    );
    return true;
  };
}
