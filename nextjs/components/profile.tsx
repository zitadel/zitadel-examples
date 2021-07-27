import { signIn, signOut, useSession } from 'next-auth/client';

export default function Profile() {
    const [session, loading] = useSession();

    return <>
        {!session && <>
            <p>Not signed in</p>
            <br />

            <button onClick={() => signIn('zitadel', { callbackUrl: 'http://localhost:3000/profile' })}>
                Sign in
            </button>
        </>}
        {session && <>
            <p>Signed in as {session.user.email}
                <br />
            </p>
            <button onClick={() => signOut()}>Sign out</button>
        </>}
    </>;
}