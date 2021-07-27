import NextAuth from 'next-auth';


export default NextAuth({
    providers: [
        {
            id: "zitadel",
            name: "zitadel",
            type: "oauth",
            version: "2.0",
            scope: "openid profile email",
            params: { grant_type: "authorization_code" },
            authorizationParams: { grant_type: "authorization_code", response_type: "code" },
            accessTokenUrl: "https://api.zitadel.dev/oauth/v2/token",
            requestTokenUrl: "https://api.zitadel.dev/oauth/v2/token",
            authorizationUrl: "https://accounts.zitadel.dev/oauth/v2/authorize",
            profileUrl: "https://api.zitadel.dev/oauth/v2/userinfo",
            protection: "pkce",
            async profile(profile: any, tokens) {
                console.log(profile, tokens);
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture
                };
            },
            clientId: process.env.ZITADEL_CLIENT_ID,
            clientSecret: ''
        },
    ],
});