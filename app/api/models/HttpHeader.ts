import { ContentType } from "../type";

export class HttpHeader {
  private readonly _headers: Headers;
  constructor(contentType: ContentType, token?: string) {
    if (token != undefined) {
      this._headers = new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType,
      });
    } else {
      this._headers = new Headers({ "Content-Type": contentType });
    }
  }
  public get headers() {
    return this._headers;
  }
}
