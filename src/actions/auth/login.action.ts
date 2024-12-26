import { firebase } from '@/firebase/config';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { signInWithEmailAndPassword, type AuthError } from 'firebase/auth';

export const loginUser = defineAction({
    accept: 'form',
    input: z.object({
        email: z.string().email(),
        password: z.string().min(6),
        remember_me: z.boolean().optional(),
    }),
    handler: async ({ email, password, remember_me }, { cookies }) => {
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

        try {
            const userCredential = await signInWithEmailAndPassword(
                firebase.auth,
                email,
                password
            );

            const user = userCredential.user;

            //Actualizar el nombre(displayName)

            //Verificar el email

            return {
                ok: true,
                //msg: 'Usuario creado exitosamente',
                user: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                },
            };

        } catch (error) {
            console.log(error);

            const firebaseError = error as AuthError;
            throw new Error(`Auxilio! algo salío mal: ${firebaseError.message}`);
        }
    },
});