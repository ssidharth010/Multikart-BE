export class CustomError extends Error {
  public statusCode;

  constructor(error: any) {
    if (error.name == "MongoServerError" && error.code == 11000) {
      super(`Duplicate Key Error - ${JSON.stringify(error.keyValue)}`);
      this.statusCode = 409;
    } else {
      super(error.message);
      this.statusCode = error.statusCode ?? 500;
    }
    this.name = error.name;
  }
}
