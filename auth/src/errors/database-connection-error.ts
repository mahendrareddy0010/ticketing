import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = "Error connecting to Database";
  statusCode = 400;

  constructor() {
    super("Error connecting to db");
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  serializeErrors = () => {
    return [
      {
        message: this.reason,
      },
    ];
  };
}
