import { handleFetchErrors } from './middleware';

var jwt = require("jsonwebtoken");

type ZitadelSecret = {
  type: string;
  userId: string;
  keyId: string;
  key: string;
};

export type BearerToken = {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
};

export function requestAccessToken(): Promise<BearerToken> {
  const secret: ZitadelSecret = JSON.parse(
    process.env.SERVICE_ACCOUNT_SECRET as any
  );

  const jwtPayload = {
    iss: secret.userId,
    sub: secret.userId,
    aud: "https://issuer.zitadel.ch",
    alg: "RS256",
    kid: secret.keyId,
    iat: Math.floor(Date.now() / 1000) - 5, // offset the time see zitadel/zitadel #2704
    exp: Math.floor(Date.now() / 1000) + 30 * 60,
  };

  try {
    var token = jwt.sign(jwtPayload, secret.key, {
      algorithm: "RS256",
      header: { kid: secret.keyId },
    });
  } catch (error) {
    console.error("error on signin token", error);
    return Promise.reject(error);
  }

  const url = "https://api.zitadel.ch/oauth/v2/token?";

  return fetch(
    url +
      new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        scope:
          "openid profile email urn:zitadel:iam:org:project:id:69234237810729019:aud",
        assertion: token,
      }),
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    }
  )
    .then((resp) => resp.json())
    .catch((error) => {
      console.error("get token error", error);
      return Promise.reject(error);
    });
}

export function hasRole(
  role: string,
  orgId: string,
  authHeader: string
): Promise<boolean> {
  const userInfoEndpoint = "https://api.zitadel.ch/oauth/v2/userinfo";
  return fetch(userInfoEndpoint, {
    headers: {
      authorization: authHeader,
      "content-type": "application/json",
    },
    method: "GET",
  })
    .then(handleFetchErrors)
    .then((resp) => resp.json())
    .then((resp) => {
      const scope = "urn:zitadel:iam:org:project:roles";
      const roles = resp[scope];

      return roles && roles[role] && roles[role][orgId];
    })
    .catch(() => {
      return false;
    });
}
