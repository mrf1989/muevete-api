const ERR_UNKNOWN_USER = new Error("Usuario no identificado");

export function getCookies(cookie: string, cookies: string): string {
    const mapCookies = getSessionCookie(cookies);
    const isPresent = mapCookies.has(cookie);

    if (isPresent && mapCookies.get(cookie)! !== "deleted") return mapCookies.get(cookie)!;
    throw ERR_UNKNOWN_USER;
}

function getSessionCookie(cookies: string): Map<string, string> {
    const res = new Map<string, string>();  
    try {
        cookies.split(";").map(cookie => {
            const cookieMap = cookie.split("=");
            res.set(cookieMap[0].trim(), cookieMap[1].trim());
        });
    } catch (err) {
        throw ERR_UNKNOWN_USER;
    }
    return res;
}