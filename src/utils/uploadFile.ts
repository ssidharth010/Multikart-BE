import multer from "multer";
import { CustomError } from "./customError";
import logger from "./logger";
import { Request,Response,NextFunction } from "express";


const upload = (fileType: Array<string>, type: string,field: {name:string,maxCount:number}[], store = "AWS") => (req:Request,res:Response,next:NextFunction) => {
  const multerFunction = multer({
    fileFilter(req, file, cb) {
      logger.debug(file);
      const ext = file.mimetype.split("/")[1];
      if (fileType.includes(ext)) {
        return cb(null, true);
      }
      return cb(
        new CustomError({
          message: "Please upload file of correct format",
          statusCode: 400,
        })
      );
    },
    limits: {
      fileSize: 100000000,
    },
    storage:
      multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, store);
            },
            filename: function (req, file, cb) {
              cb(null, `${Date.now().toString()}-${file.originalname}`);
            },
      }),
  });

  let result;
  switch(type) {
    case 'single':
      console.log(field)
      result =  multerFunction.single(field[0].name);break;
    case 'array': 
      result = multerFunction.array(field[0].name,field[0].maxCount);break;
    case 'fields': 
      result = multerFunction.fields(field);break;
    default:
      result = multerFunction.none()
  }
  return result(req,res, function(err) {
    if (err instanceof multer.MulterError) {
      next(new CustomError({ message: err.message, statusCode: 400 }));
    } else if (err) {
      next(new CustomError(err));
    }
    next();
  })
}

export { upload };
