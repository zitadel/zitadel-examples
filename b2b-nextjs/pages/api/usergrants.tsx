import { NextApiRequest, NextApiResponse } from 'next';

import { BearerToken, hasRole, requestAccessToken } from '../../lib/jwt';
import { handleFetchErrors } from '../../lib/middleware';

function getUserGrants(
  orgId: string,
  authorizationHeader: string
): Promise<any> {
  return hasRole("admin", orgId, authorizationHeader)
    .then((isAllowed) => {
      if (isAllowed) {
        return requestAccessToken().then((token: BearerToken) => {
          const request = `https://api.zitadel.ch/management/v1/users/grants/_search`;
          return fetch(request, {
            headers: {
              authorization: `Bearer ${token.access_token}`,
              "x-zitadel-org": "129336476931515070", //orgId,
              "content-type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              query: {
                limit: 100,
                asc: true,
              },
              queries: [
                {
                  projectIdQuery: {
                    projectId: process.env.PROJECT_ID,
                  },
                },
                {
                  // projectGrantIdQuery: {
                  //   projectGrantId: 132244672369190498,
                  // },
                  withGrantedQuery: {
                    withGranted: true,
                  },
                },
              ],
            }),
          })
            .then(handleFetchErrors)
            .then((resp) => {
              return resp.json();
            })
            .then((resp) => {
              const grants = resp.result
                ? resp.result.filter((grant) => grant.orgId === orgId)
                : [];
              const newResp = {
                ...resp,
                result: grants,
              };
              return newResp;
            });
        });
      } else {
        throw new Error("not allowed");
      }
    })

    .catch((error) => {
      throw new Error("not allowed");
    });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const orgId = req.headers.orgid as string;
    const authorizationHeader = req.headers.authorization as string;

    return getUserGrants(orgId, authorizationHeader)
      .then((resp) => {
        res.status(200).json(resp);
      })
      .catch((error) => {
        console.error("got an error", error);
        res.status(500).json(error);
      });
  }
};

export default handler;
