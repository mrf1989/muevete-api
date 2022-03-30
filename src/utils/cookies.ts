export function getCookies(cookie: string, cookies: string): string {
    const mapCookies = getSessionCookie(cookies);
    const isPresent = mapCookies.has(cookie);

    if (isPresent && mapCookies.get(cookie)! !== "deleted") return mapCookies.get(cookie)!;
    throw new Error(`No existe valor para la cookie ${cookie}`);
}

function getSessionCookie(cookies: string): Map<string, string> {
    const res = new Map<string, string>();  
    cookies.split(";").map(cookie => {
        const cookieMap = cookie.split("=");
        res.set(cookieMap[0].trim(), cookieMap[1].trim());
    })
    return res;
}