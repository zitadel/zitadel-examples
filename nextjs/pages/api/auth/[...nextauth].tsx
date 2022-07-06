import NextAuth from 'next-auth';

export default NextAuth({
  providers: [
    {
      id: "zitadel",
      name: "zitadel",
      type: "oauth",
      version: "2",
      wellKnown: process.env.ZITADEL_ISSUER,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
      idToken: true,
      checks: ["pkce", "state"],
      client: {
        token_endpoint_auth_method: "none",
      },
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          loginName: profile.preferred_username,
          image: profile.picture,
        };
      },
      clientId: process.env.ZITADEL_CLIENT_ID,
    },
  ],
});
