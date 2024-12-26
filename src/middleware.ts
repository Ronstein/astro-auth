import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";
import { firebase } from "./firebase/config";

const privateRoutes = ['/protected'];
const notAuthenticatedRoutes = ['/login', '/register'];

// `context` and `next` are automatically typed
// export const onRequest = defineMiddleware(async (context, next) => {
export const onRequest = defineMiddleware(async ({ url, request, locals, redirect }, next) => {

    const isLoggedIn = !!firebase.auth.currentUser;
    const user = firebase.auth.currentUser;

    locals.isLoggedIn = isLoggedIn;

    if (user) {
        locals.user = {
            avatar: user.photoURL ?? '',
            email: user.email!,
            name: user.displayName!,
            emailVerified: user.emailVerified,
        }
    }

    if (!isLoggedIn && privateRoutes.includes(url.pathname)) {
        return redirect('/');
    }

    if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
        return redirect('/');
    }

    return next();
});

// export const onRequest = defineMiddleware(async ({ url, request }, next) => {


//     // console.log('Ejecutando en el middleware');
//     // console.log(context.url);

//     const authHeaders = request.headers.get('authorization') ?? '';
//     // console.log(authHeaders);


//     if (privateRoutes.includes(url.pathname)) {
//         return checkLocalAuth(authHeaders, next);
//     }

//     // return new Response(
//     //     JSON.stringify({
//     //         hola: 'mundo',
//     //     })
//     // );
//     return next();
// });

const checkLocalAuth = (authHeaders: string, next: MiddlewareNext) => {

    return next();
}