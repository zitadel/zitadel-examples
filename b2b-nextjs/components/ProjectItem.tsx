import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

import localizedDate from '../lib/localized-date';

const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
});
export type ZitadelProjectGrant = {
  details: {
    sequence: string;
    creationDate: string;
    changeDate: string;
    resourceOwner: string;
  };
  grantId: string;
  grantedOrgId: string;
  grantedOrgName: string;
  grantedRoleKeys: string[];
  projectId: string;
  projectName: string;
  projectOwnerId: string;
  projectOwnerName: string;
  state: string;
};
export default function ProjectItem({
  project,
}: {
  project: ZitadelProjectGrant;
}) {
  const { locale } = useRouter();
  return (
    <a
      data-tip={`Actions coming soon`}
      className={`
                ${open ? "" : "text-opacity-90"}
                h-full w-full transition-all outline-none focus:outline-none border border-gray-200 dark:border-gray-500 dark:hover:bg-opacity-30 flex flex-col rounded-xl bg-white dark:bg-white dark:bg-opacity-20 relative p-4 py-6 pb-8 hover:shadow`}
    >
      <p className="dark:text-white text-left mb-4">{project.projectName}</p>
      {project.state === "PROJECT_GRANT_STATE_ACTIVE" && (
        <div className="flex items-center mb-2">
          <p>active</p>
          <div className="mx-2 h-2 w-2 rounded-full bg-green-500 shadow"></div>
        </div>
      )}
      {project.state === "PROJECT_GRANT_STATE_INACTIVE" && (
        <div className="flex items-center mb-2">
          <p>inactive</p>
          <div className="mx-2 h-2 w-2 rounded-full bg-red-500 shadow"></div>
        </div>
      )}

      <ReactTooltip backgroundColor={"#5b5d72"} effect="solid" />

      <span className="text-sm text-left text-gray-500 dark:text-gray-300">
        created: {localizedDate(project.details.creationDate, locale)}
      </span>

      <span className="text-sm text-left text-gray-500 dark:text-gray-300">
        roles:{" "}
        {project?.grantedRoleKeys ? project.grantedRoleKeys.join(", ") : ""}
      </span>

      <div className="absolute bottom-0 right-0">
        <Menu as="div" className="relative inline-block text-left z-10">
          <div>
            <Menu.Button className="inline-flex px-3 py-2 justify-center text-sm font-medium rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <DotsVerticalIcon
                className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-30 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-30 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 w-40 mt-2 origin-top-right bg-white dark:bg-gray-500 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`https://console.zitadel.ch/granted-projects/${project.projectId}/grant/${project.grantId}`}
                      className={`${
                        active
                          ? "text-black dark:text-white"
                          : "text-gray-600 dark:text-gray-200"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >
                      {active ? (
                        <i className={`text-2xl las la-edit mr-2`}></i>
                      ) : (
                        <i className="text-2xl las la-edit mr-2"></i>
                      )}
                      Open in Console
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </a>
  );
}
