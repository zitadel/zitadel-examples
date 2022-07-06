import { handleFetchErrors } from './middleware';

export function hasRole(
  role: string,
  orgId: string,
  authHeader: string
): Promise<boolean> {
  const userInfoEndpoint = `${process.env.ZITADEL_ISSUER}/oidc/v1/userinfo`;
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
