import base64url from "base64url";
import config from "../../config/environment";
import cookie from "cookie";
import proxy from "request";
import winston from "winston";

// [SSO] authentication
export function login (req, res) {
    winston.info("[SSO] - crosslogin");

    const headers = req.headers;
    headers.host = config.ssoAuth.host;

    proxy.get({
        url: config.ssoAuth.baseUrl + req.url,
        headers,
        proxy: config.proxy ? config.proxy.host : "",
        followRedirect: false
    }, (err, resp) => {
        if (err) {
            winston.error("[SSO] - crosslogin - error: ", err);
            return res.status(500);
        }

        const cookies = resp.headers["set-cookie"];
        let parsedCookie;

        for (let i = cookies.length - 1; i >= 0; i--) {
            parsedCookie = cookie.parse(cookies[i]);

            if (parsedCookie["CA.OVH.SES"]) {
                res.cookie("CA.OVH.SES", parsedCookie["CA.OVH.SES"], { path: "/", httpOnly: true });
            }
            if (parsedCookie.SESSION) {
                res.cookie("SESSION", parsedCookie.SESSION, { path: "/", httpOnly: true });
            }
            if (parsedCookie.USERID) {
                res.cookie("USERID", parsedCookie.USERID, { path: "/" });
            }
        }

        winston.info("[SSO] - Logged");

        return res.redirect(resp.headers.location);
    });
}

export function auth (req, res) {
    const origin = req.headers.host;
    const protocol = req.protocol || "http";
    const headers = req.headers;
    headers.host = config.ssoAuth.host;

    proxy.post({
        url: config.ssoAuth.devLoginUrl,
        proxy: config.proxy ? config.proxy.host : null,
        headers,
        followRedirect: false,
        gzip: true,
        json: {
            callbackUrl: `${protocol}://${origin}/auth/check`
        }
    }, (err, resp, data) => {
        if (err) {
            return res.status(500);
        }

        return res.redirect(data.data.url);
    });
}

export function checkAuth (req, res) {
    const headers = req.headers;
    headers.host = config.ssoAuth.host;

    let cookies = [];

    try {
        cookies = JSON.parse(base64url.decode(req.query.data));

        if (Array.isArray(cookies.cookies)) {
            cookies.cookies.forEach((c) => {

                const parsedCookie = cookie.parse(c);

                if (parsedCookie["CA.OVH.SES"]) {
                    res.cookie("CA.OVH.SES", parsedCookie["CA.OVH.SES"], { path: "/", httpOnly: true });
                }

                if (parsedCookie.SESSION) {
                    res.cookie("SESSION", parsedCookie.SESSION, { path: "/", httpOnly: true });
                }
                if (parsedCookie.USERID) {
                    res.cookie("USERID", parsedCookie.USERID, { path: "/" });
                }
            });
        }
    } catch (err) {
        console.error(err);
    }

    res.redirect("/");
}
