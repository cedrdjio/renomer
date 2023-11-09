export class DefaultResponse<T> {
  constructor(public status: number, public message: string, public data: T) {}
}
