import { firebase } from '@/firebase/config';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, type AuthError } from 'firebase/auth';

export const registerUser = defineAction({
    accept: 'form',
    input: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        remember_me: z.boolean().optional(),
    }),
    handler: async ({ name, email, password, remember_me }, { cookies }) => {
        // handler: async (input, context) => {
        // console.log({ name, email, password, remember_me });

        //cokies
        if (remember_me) {
            cookies.set('email', email, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 año
                path: '/'
            })
        } else {
            cookies.delete('email', {
                path: '/'
            })
        }

        //creacion de usuario

        try {
            const userCredential = await createUserWithEmailAndPassword(
                firebase.auth,
                email,
                password,
            );

            const user = userCredential.user;

            //Actualizar el nombre(displayName)
            updateProfile(firebase.auth.currentUser!, {
                displayName: name,
            });

            //Verificar el email
            await sendEmailVerification(firebase.auth.currentUser!, {
                // url: 'http://localhost:4321/protected?emailVerified=true'
                url: `${import.meta.env.WEBSITE_URL}/protected?emailVerified=true`
            });

            return {
                ok: true,
                msg: 'Usuario creado exitosamente',
                user: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                },
            };

        } catch (error) {
            console.log(error);

            const firebaseError = error as AuthError;
            if (firebaseError.code === 'auth/email-already-in-use') {
                throw new Error("El correo ya está en uso");
            }

            throw new Error("Auxilio! algo salío mal");

        }
    },
});