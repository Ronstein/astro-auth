//No funciona por el nombre del archivo
//Demostracion

import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";

const privateRoutes = ['/protected'];

// `context` and `next` are automatically typed
// export const onRequest = defineMiddleware(async (context, next) => {
export const onRequest = defineMiddleware(async ({ url, request }, next) => {

    // console.log('Ejecutando en el middleware');
    // console.log(context.url);

    const authHeaders = request.headers.get('authorization') ?? '';
    console.log(authHeaders);


    if (privateRoutes.includes(url.pathname)) {
        return checkLocalAuth(authHeaders, next);
    }

    // return new Response(
    //     JSON.stringify({
    //         hola: 'mundo',
    //     })
    // );
    return next();
});

const checkLocalAuth = (authHeaders: string, next: MiddlewareNext) => {
    if (authHeaders) {
        const authValue = authHeaders.split(' ').at(-1) ?? 'user:pass';
        const decodedValue = atob(authValue).split(':');
        // console.log(decodedValue);
        const [user, password] = decodedValue;

        //validaciones de bd etc
        if (user === 'admin' && password === 'admin') return next();
    }


    return new Response('Auth Necesaria', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic real="Secure Area"'
        }
    })
}