import NextAuth from 'next-auth';

export default NextAuth({
  session: {
    jwt: true,
    maxAge: 0.5 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (profile?.sub) {
        token.sub = profile.sub;
      }
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      if (typeof user !== typeof undefined) {
        token.user = user;
      }
      return token;
    },
    session: async function session({ session, token }) {
      session.accessToken = token.accessToken;
      session.id = token.id;
      session.sub = token.sub;
      session.user = token.user;
      return session;
    },
  },
  providers: [
    {
      id: "zitadel",
      name: "zitadel",
      type: "oauth",
      version: "2.0",
      scope:
        "openid profile email urn:zitadel:iam:org:project:id:69234237810729019:aud",
      params: { grant_type: "authorization_code" },
      authorizationParams: {
        grant_type: "authorization_code",
        response_type: "code",
      },
      accessTokenUrl: "https://api.zitadel.ch/oauth/v2/token",
      requestTokenUrl: "https://api.zitadel.ch/oauth/v2/token",
      authorizationUrl: "https://accounts.zitadel.ch/oauth/v2/authorize",
      profileUrl: "https://api.zitadel.ch/oauth/v2/userinfo",
      checks: "pkce",
      async profile(profile: any, tokens) {
        const prof = {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          roles: profile["urn:zitadel:iam:org:project:roles"],
        };
        return prof;
      },
      clientId: process.env.ZITADEL_CLIENT_ID ?? "",
      clientSecret: "",
    },
  ],
});
