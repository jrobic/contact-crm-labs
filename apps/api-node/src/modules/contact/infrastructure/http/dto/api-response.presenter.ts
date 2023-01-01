export class ApiResponse<TData> {
  readonly #code: number;

  readonly #data: TData | null;

  readonly #message: string;

  readonly #timestamp: string;

  constructor(code: number, message: string, data?: TData) {
    this.#code = code;
    this.#message = message;
    this.#data = data ?? null;
    this.#timestamp = new Date().toISOString();
  }

  public static success<TData>(
    code = 200,
    data?: TData,
    message = "Success"
  ): ApiResponse<TData> {
    return new ApiResponse<TData>(code, message, data);
  }

  public static error<TData>(
    code = 500,
    data?: TData,
    message = "Internal error"
  ): ApiResponse<TData> {
    return new ApiResponse<TData>(code, message, data);
  }

  toJSON() {
    return {
      code: this.#code,
      data: this.#data,
      message: this.#message,
      timestamp: this.#timestamp,
    };
  }
}
