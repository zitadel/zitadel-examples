import { useSession } from "next-auth/react";

import orgStore from "../lib/org";

// const fetcher = async (url: string) => {
//   const session = (await getSession()) as any;
//   const org = orgStore.getState().org;

//   return fetch(`${url}`, {
//     method: "POST",
//     headers: {
//       "content-Type": "application/json",
//       authorization: `Bearer ${session.accessToken}`,
//       "x-zitadel-org": org.id,
//     },
//     body: JSON.stringify({
//       query: {
//         limit: 100,
//         asc: true,
//       },
//       queries: [
//         {
//           orgIdQuery: {
//             orgId: org.id,
//           },
//         },
//         {
//           projectIdQuery: {
//             projectId: "129248442986851557",
//           },
//         },
//       ],
//     }),
//   })
//     .then((res) => res.json())
//     .then((resp) => resp.result[0].roles)
//     .catch((error) => {
//       console.error(error);
//     });
// };

export default function UserGrant() {
  //   const { data: roles, error: orgError } = useSWR(
  //     "https://api.zitadel.ch/auth/v1/usergrants/me/_search",
  //     (url) => fetcher(url)
  //   );

  //   console.log(roles);
  const org = orgStore((state) => (state as any).org);

  const { data: session } = useSession();

  let roles = [];
  if (session && session.user && org?.id && session.user.roles) {
    roles = Object.keys(session.user.roles).map((role) => {
      return session.user.roles[role][org.id] ? role : null;
    });
  }

  return (
    session && (
      <div className="py-4">
        You have{" "}
        <strong
          className={`${
            roles && roles.length ? "text-green-500" : "text-red-500"
          }`}
        >
          {roles && roles.length ? roles.join(",") : "no"}
        </strong>{" "}
        roles for this application and the organization set above.
      </div>
    )
  );
}
