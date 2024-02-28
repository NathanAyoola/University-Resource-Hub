export default class HttpError extends Error {
    statusCode: number;
    // eslint-disable-next-line lines-between-class-members
    data: object | null;
  
    constructor(
      message: string,
      statusCode: number = 500,
      data: object | null = null
    ) {
      super(message);
      this.statusCode = statusCode;
      this.data = data;
    }
  }