import { APIMethods } from "../type";
import { HttpHeader } from "./HttpHeader";

export class CustomRequest implements RequestInit {
  private readonly _method?: string;
  private readonly _headers?: Headers;
  private readonly _body?: BodyInit;
  private readonly _signal?: AbortSignal;
  constructor(
    method: APIMethods,
    headers?: HttpHeader,
    body?: BodyInit,
    signal?: AbortSignal
  ) {
    this._method = method;
    this._headers = headers?.headers;
    this._body = body;
    this._signal = signal;
  }
  public get method() {
    return this._method;
  }
  public get headers() {
    return this._headers;
  }
  public get body() {
    return this._body;
  }
}
