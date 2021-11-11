import { NextApiRequest, NextApiResponse } from 'next';

import { BearerToken, hasRole, requestAccessToken } from '../../lib/jwt';
import { handleFetchErrors } from '../../lib/middleware';

function getGrantedProjectsOfUser(
  userId: string,
  orgId: string,
  authorizationHeader: string
): Promise<any> {
  return hasRole("reader", orgId, authorizationHeader)
    .then((isAllowed) => {
      if (isAllowed) {
        return requestAccessToken().then((token: BearerToken) => {
          // console.log(token);
          const request = `https://api.zitadel.ch/management/v1/projectgrants/_search`;
          return fetch(request, {
            headers: {
              authorization: `Bearer ${token.access_token}`,
              "x-zitadel-org": process.env.ORG_ID,
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
                  grantedOrgIdQuery: {
                    grantedOrgId: orgId,
                  },
                },
              ],
            }),
          })
            .then(handleFetchErrors)
            .then((resp) => {
              return resp.json();
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
  //   await runMiddleware(req, res, cors);

  if (req.method === "GET") {
    const userId = req.headers.userid as string;
    const orgId = req.headers.orgid as string;
    const authorizationHeader = req.headers.authorization as string;

    return getGrantedProjectsOfUser(userId, orgId, authorizationHeader)
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
