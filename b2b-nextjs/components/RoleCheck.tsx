import { useSession } from "next-auth/react";
import { useContext } from "react";

import orgStore from "../lib/org";

export default function RolesCheck(props: any) {
  const { data: session } = useSession();
  const org = orgStore((state) => (state as any).org);

  const hasRoles = !!(
    org &&
    org.id &&
    session &&
    session.user &&
    session.user.roles &&
    (props.requiredRole
      ? session.user.roles[props.requiredRole] &&
        session.user.roles[props.requiredRole][org.id]
      : Object.keys(session.user.roles).findIndex((role) => {
          return session.user.roles[role][org.id];
        }) > -1)
  );

  return session && session.accessToken && hasRoles
    ? props.children
    : props.fallback || (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col items-center">
            <p className="mb-4 text-red-500">
              You don&apos;t have any roles for this organization
            </p>
          </div>
        </div>
      );
}
