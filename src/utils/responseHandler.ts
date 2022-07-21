import { Request, Response } from "express";
import logger from "./logger";

const successHandler = (
  res: Response,
  response: any,
  query?: Request["query"] | { per_page: any; current_page: any }
): void => {
  const { count = null, message = null, data = null } = response;
  const { per_page, current_page } = query
    ? query
    : { per_page: null, current_page: null };
  const total_page =
    count && per_page ? Math.ceil(count / parseInt(per_page)) : null;
  const meta = { count, total_page, current_page: parseInt(current_page) };
  res.status(200).send({ meta, success: true, message, data });
};

const errorHandler = (res: Response, error: any): void => {
  const { statusCode = 500, message} = error;
  logger.error(error.stack ?? error);
  res.status(statusCode).send({
    success: false,
    message: statusCode === 500 ? "Unable to process at the moment" : message,
  });
};

export { errorHandler, successHandler };
