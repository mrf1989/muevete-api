// Depedencias de framework MandarineTS v2.3.2
export {
  AllowOnly,
  AuthPrincipal,
  Component,
  Controller,
  DELETE,
  GET,
  Mandarine,
  MandarineCore,
  Middleware,
  Override,
  POST,
  PUT,
  QueryParam,
  RequestBody,
  RequestParam,
  ResponseParam,
  RouteParam,
  Service,
  Session,
} from "https://raw.githubusercontent.com/mrf1989/mandarinets/pr-v2.3.3/mod.ts";
//} from "../mandarinets/mod.ts";

export { createHash } from "https://deno.land/std@0.129.0/hash/mod.ts";
export {
  deleteCookie,
  getCookies,
  setCookie,
} from "https://deno.land/std@0.94.0/http/cookie.ts";
export type { Cookie } from "https://deno.land/std@0.94.0/http/cookie.ts";

// Dependencias de MongoDB
export { Bson, MongoClient } from "https://deno.land/x/mongo@v0.23.0/mod.ts";
export { Database } from "https://deno.land/x/mongo@v0.23.0/src/database.ts";
export { Collection } from "https://deno.land/x/mongo@v0.23.0/src/collection/mod.ts";

// Dependencias de testing
export { Rhum } from "https://deno.land/x/rhum@v1.1.13/mod.ts";
export type { Stubbed } from "https://deno.land/x/rhum@v1.1.13/mod.ts";
export * as asserts from "https://deno.land/std@0.106.0/testing/asserts.ts";

// Dependencias para denon
// Requieres instalar denon
// deno install -qAf --unstable https://deno.land/x/denon@2.4.8/denon.ts
export type { DenonConfig } from "https://deno.land/x/denon@2.4.7/mod.ts";
export { config as env } from "https://deno.land/x/dotenv/mod.ts";
