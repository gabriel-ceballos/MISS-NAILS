/* =========================================================
   MISS NAILS
   AUTENTICACIÓN
   ========================================================= */

const MISS_NAILS_AUTH_CONFIG = {
    googleClientId:
        "375980187783-shvrkd8d0nkeaem7tju07co7bponc9ev.apps.googleusercontent.com",

    microsoftClientId:
        "0ad43298-3dcc-4622-9b75-f58c73dd695f",

    microsoftAuthority:
        "https://login.microsoftonline.com/common",

    microsoftRedirectUri() {
        return window.location.origin + window.location.pathname;
    }
};


function base64UrlEncode(bytes) {
    let binary = "";

    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}


async function generarPkce() {
    const bytes = new Uint8Array(32);

    crypto.getRandomValues(bytes);

    const verifier =
        base64UrlEncode(bytes);

    const digest =
        await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(verifier)
        );

    const challenge =
        base64UrlEncode(
            new Uint8Array(digest)
        );

    return {
        verifier,
        challenge
    };
}


function generarValorSeguro() {
    const bytes = new Uint8Array(32);

    crypto.getRandomValues(bytes);

    return base64UrlEncode(bytes);
}


window.auth = {

    async login(
        correo,
        password
    ) {

        return await api(
            "login",
            {
                correo,
                password
            }
        );
    },


    async loginFederado(
        proveedor,
        token,
        contexto = {}
    ) {

        return await api(
            "login_federado",
            {
                proveedor,
                token,
                ...contexto
            }
        );
    },


    async loginGoogle(
        credential
    ) {

        return await this.loginFederado(
            "google",
            credential
        );
    },


    async iniciarMicrosoft() {

        const pkce =
            await generarPkce();

        const state =
            generarValorSeguro();

        const nonce =
            generarValorSeguro();

        sessionStorage.setItem(
            "missNailsMicrosoftAuth",
            JSON.stringify({
                state,
                nonce,
                verifier: pkce.verifier
            })
        );

        const parametros =
            new URLSearchParams({
                client_id:
                    MISS_NAILS_AUTH_CONFIG.microsoftClientId,
                response_type:
                    "code",
                redirect_uri:
                    MISS_NAILS_AUTH_CONFIG.microsoftRedirectUri(),
                response_mode:
                    "query",
                scope:
                    "openid profile email",
                state,
                nonce,
                code_challenge:
                    pkce.challenge,
                code_challenge_method:
                    "S256"
            });

        window.location.assign(
            `${MISS_NAILS_AUTH_CONFIG.microsoftAuthority}/oauth2/v2.0/authorize?${parametros.toString()}`
        );
    },


    async procesarMicrosoftRedirect() {

        const parametros =
            new URLSearchParams(
                window.location.search
            );

        const code =
            parametros.get("code");

        const state =
            parametros.get("state");

        const error =
            parametros.get("error");

        if (!code && !error) {
            return null;
        }

        const urlLimpia =
            window.location.origin +
            window.location.pathname;

        window.history.replaceState(
            {},
            document.title,
            urlLimpia
        );

        const guardado =
            sessionStorage.getItem(
                "missNailsMicrosoftAuth"
            );

        sessionStorage.removeItem(
            "missNailsMicrosoftAuth"
        );

        if (!guardado) {
            return {
                ok: false,
                mensaje:
                    "No se encontró el estado de autenticación de Microsoft."
            };
        }

        let datos;

        try {
            datos = JSON.parse(guardado);
        } catch (e) {
            return {
                ok: false,
                mensaje:
                    "No fue posible recuperar la autenticación de Microsoft."
            };
        }

        if (error) {
            return {
                ok: false,
                mensaje:
                    parametros.get("error_description") ||
                    "Microsoft canceló el inicio de sesión."
            };
        }

        if (!state || state !== datos.state) {
            return {
                ok: false,
                mensaje:
                    "La validación de seguridad de Microsoft no coincide."
            };
        }

        if (!code) {
            return {
                ok: false,
                mensaje:
                    "Microsoft no devolvió un código de autenticación."
            };
        }

        try {
            const body =
                new URLSearchParams({
                    client_id:
                        MISS_NAILS_AUTH_CONFIG.microsoftClientId,
                    grant_type:
                        "authorization_code",
                    code,
                    redirect_uri:
                        MISS_NAILS_AUTH_CONFIG.microsoftRedirectUri(),
                    code_verifier:
                        datos.verifier
                });

            const respuesta =
                await fetch(
                    `${MISS_NAILS_AUTH_CONFIG.microsoftAuthority}/oauth2/v2.0/token`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded"
                        },
                        body
                    }
                );

            const token =
                await respuesta.json();

            if (
                !respuesta.ok ||
                !token.id_token
            ) {
                return {
                    ok: false,
                    mensaje:
                        token.error_description ||
                        "Microsoft no devolvió una identidad válida."
                };
            }

            return await this.loginFederado(
                "microsoft",
                token.id_token,
                {
                    nonce: datos.nonce
                }
            );

        } catch (error) {

            console.error(
                "AUTH → Microsoft:",
                error
            );

            return {
                ok: false,
                mensaje:
                    "No fue posible completar el acceso con Microsoft."
            };
        }
    }
};
