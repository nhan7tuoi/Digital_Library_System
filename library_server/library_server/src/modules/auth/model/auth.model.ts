import mongoose from "mongoose";
import { VerificationCodeType } from "../types/auth.type";

const verificationSchema = new mongoose.Schema({
  email: { type: String },
  code: { type: String },
  expiredAt: { type: Date },
  createdAt: { type: String },
  status: {
    type: Number,
    enum: [VerificationCodeType.Active, VerificationCodeType.Deleted],
    default: VerificationCodeType.Active,
  },
});

verificationSchema.index({ email: 1, status: 1, code: 1 });

const Verification = mongoose.model("Verification", verificationSchema);
export default Verification;
