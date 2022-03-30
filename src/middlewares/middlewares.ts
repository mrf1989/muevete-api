import { RequestParam, Middleware, MiddlewareTarget } from "../../deps.ts";
import { getCookies } from "../utils/utils.ts";

@Middleware(new RegExp('/api/admin/*'))
export class AutorizaAdmin implements MiddlewareTarget {
    public onPreRequest(@RequestParam() request: Request): boolean {
        const cookies = getCookies("userSession", request.headers.get("cookie")!).split("##");
        const rol = cookies[1].trim();
        if (rol === "admin") return true;
        else throw new Error("Usuario no autorizado");
    }

    public async onPostRequest(): Promise<void> {
        // nothing to do
    }
}