import { bootClientMocks } from "./client";
import { bootServerMocks } from "./server";

export function bootMocks() {
  const serverSide = global.window === undefined;
  
  serverSide
    ? bootServerMocks().listen()
    : bootClientMocks().start();
}
