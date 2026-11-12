export class HttpError extends Error {
  constructor(status, message, fieldErrors) { super(message); this.status = status; this.fieldErrors = fieldErrors }
}
