import type { TypedSession } from "remix-utils";

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    session: TypedSession
  }
}