import { Request, Response, NextFunction } from "express";
import { validationResult} from "express-validator";
import { CustomError } from "./customError";
import fs from 'fs'

export const validate =
  (expectedSchema: Array<string>) =>
  (req: Request, res: Response, next: NextFunction):void => {
    try {
      if (
        ![
          ...Object.keys(Array.isArray(req.body)?{}:req.body),
          ...Object.keys(req.params),
          ...Object.keys(req.query),
        ].every((e) => expectedSchema.includes(e))
      ) {
        throw new CustomError({
          message: "Unexpected field in request",
          statusCode: 400,
        });
      }
      const errorFormatter = ({ msg }: { msg: string }) => {
        return `${msg}`;
      };
      const result = validationResult(req).formatWith(errorFormatter);
      if (result.isEmpty()) {
        next();
      } else {
        throw new CustomError({
          message: JSON.stringify(result.mapped()),
          statusCode: 400,
        });
      }
    } catch (err) {
      if (req.files && Array.isArray(req.files) && req.files.length) {
        req.files.forEach((e) => fs.unlinkSync(e.path));
      }
      if(req.file) {
        fs.unlinkSync(req.file.path)
      }
      next(err);
    }
  };
