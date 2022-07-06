import { NextApiRequest, NextApiResponse } from 'next';

import { hasRole } from '../../lib/jwt';
import { handleFetchErrors } from '../../lib/middleware';

function getGrantedProjectsOfUser(
  orgId: string,
  authorizationHeader: string
): Promise<any> {
  return hasRole("reader", orgId, authorizationHeader)
    .then((isAllowed) => {
      if (isAllowed) {
        const token = process.env.SERVICE_ACCOUNT_ACCESS_TOKEN;

        const request = `${process.env.API}/management/v1/projectgrants/_search`;
        return fetch(request, {
          headers: {
            authorization: `Bearer ${token}`,
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

    return getGrantedProjectsOfUser(orgId, authorizationHeader)
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
