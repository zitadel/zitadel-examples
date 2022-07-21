# ZITADEL B2B Demo

This is a demo showcasing how you can use ZITADEL in a B2B (Business-to-Business) context, where a company is providing a customer portal to their customers:

- A user of the customer should see all granted projects in the portal ("Service discovery")
- A admin user of the customers sees a list of customer's users (could be expanded to make roles editable)

## Step 1: Setup Vendor application and users in ZITADEL

First we need to create an organization that holds the Vendor's users, projects and applications.

### Vendor Organization

Navigate to `https://{YourDomain}.zitadel.cloud/ui/console/orgs` (replace {YourDomain}), and click on the button "New".
Toggle the setting "Use your personal account as organization owner".

Enter the name `Demo-Vendor`, and click "Create". Then click on that organization.

### Portal Web Application

To setup this sample you have to create a project and an application in the vendor organization (`Demo-Vendor`) first.

Open the Console (`https://{YourDomain}.zitadel.cloud/ui/console/projects`) and create a new project. Let's call it `Portal`.

Then on the project detail page click on new application and enter a name for this app.
Let's call this one `portal-web`.
Select `Web`, continue, `PKCE`, then enter `http://localhost:3000/api/auth/callback/zitadel` for the redirect, post redirect can be kept empty.
Then press on `create`.

Copy the "Resource Id" of the project `Portal` as you will need this in your environment configuration file later.

Click on the application `portal-web`.
On the application detail page click on the section under redirect settings and enable `Development Mode`. This will allow you application to work on `localhost:3000`.
To read the user data and roles from ID Token, go to the section Token Settings and make sure both checkboxes, `User roles inside ID Token` and `User Info inside ID Token` are enabled.
Make sure to save your changes.

Copy the "Resource Id" of the application `portal-web` as you will need this in your environment configuration file later.

### Roles

To setup the needed roles for your project, navigate to your `Portal` project, and add the following roles

| Key    | Display Name  | Group | Description                                                            |
| :----- | :------------ | :---- | ---------------------------------------------------------------------- |
| admin  | Administrator |       | The administrator, allowed to read granted projects and to user grants |
| reader | Reader        |       | A user who is allowed to read his organizations granted projects only  |

Now in the `General` section of the Portal project, make sure to enable `Assert Roles on Authentication`.
This makes sure that roles, which is used by the application to enable UI components, are set in your OIDC ID Token.

### Service User

To make the application work you need a service user which loads granted-projects and user-grants for you.
In the B2B-Demo organization, navigate to `Users` in navigation of Console, click on `Service Users` and create a new user.
Let's set its username to `nextjs` and its name to `NextJS`. Then press `create`.

On the detail page of that user, navigate to "Personal Access Tokens" and add a new entry, set an optional expiration date.

Copy the generated Token as you will need this in your environment configuration file later.

Go back to the `Portal` project and add the Service User as Manager (top right).
Make sure to select `Project Owner Viewer` as the management role.

To show granted projects, go to the `Demo-Vendor` organization and add the Service User as `Org Project Permission Editor` Manager.

## Step 2: Configuration

Now clone this project and navigate to its root folder.
Create a file `.env.local` and copy paste the following:

```text
NEXTAUTH_URL=http://localhost:3000
ZITADEL_ISSUER=https://{YourDomain}.zitadel.cloud
ZITADEL_API=https://{YourDomain}.zitadel.cloud
ORG_ID={YourOrgId}
PROJECT_ID={YourProjectId}
ZITADEL_CLIENT_ID={YourClientID}
SERVICE_ACCOUNT_ACCESS_TOKEN={YourServiceAccountSecret}
NEXTAUTH_SECRET=randomsecret
```

Replace the values as follows

`NEXTAUTH_URL`: Base url of this demo app (B2B portal); runs per default on [http://localhost:3000](http://localhost:3000)

`ZITADEL_ISSUER`: The url to your zitadel instance. When using zitadel.cloud for this demo you can find the domain of your ZITADEL instance in the customer portal. You can also find this information by going to your application `portal-web` and click 'Urls' in the navigation.

`ZITADEL_API`: URL of the Management API. Typically the same as `ZITADEL_ISSUER`.

`ORG_ID`: We will create an organization during later steps. You can find `{YourOrgId}` by selecting the `Demo-Vendor` organization in Console. `{YourOrgId}` is displayed on top of the organization detail page as "Resource Id".

`PROJECT_ID`: You can find `{YourProjectId}` by clicking on "Projects" in the navigation and select the Project `Portal`. `{YourProjectId}` is displayed on the top as "Resource Id".

`ZITADEL_CLIENT_ID`: Having the project `Portal` selected, click on the Application `portal-web`. `{YourClientID}` is displayed as a field in the OIDC configuration, labelled "Client ID" and has the format `12345678@portal`.

`SERVICE_ACCOUNT_ACCESS_TOKEN`: Setup a service user, add a Personal Access Token and copy the secret here (see below).

## Step 3: Install and Run

To run this sample locally you need to install dependencies first.

Type and execute:

```bash
yarn install
```

then, to run the development server:

```bash
npm run dev
# or
yarn dev
```

and open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Step 4: Create a customer organization

### Customer organization

Create a new organization in Console. Easiest way is to use the organization dropdown on the top left.
Let's call this new organization `Demo-Customer`.

### Organization Grant

Switch to the `Demo-Vendor` organization, select Projects in the navigation, and click on `Portal` and then `Grants`.
[Grant all roles of the Project](https://docs.zitadel.ch/docs/guides/basics/projects#exercise---grant-a-project) to the organization `demo-customer.{YourDomain}.zitadel.cloud`.

### User Setup

Now switch back to the organization `Demo-Customer` and [create a new user](https://docs.zitadel.ch/docs/manuals/user-register) in this organization.
Let's call the first user `Alice Admin`. Create a second user called `Eric Employee`.

As you have guessed, these two users need to be authorized.
Navigate to Projects, and in the sub-navigation "Granted Projects".
Select the project portal `Portal` and navigate to "Authorizations".

Give `Alice Admin` the roles `reader` and `admin`.
`Eric Employee` will get only the role `reader`.

### Manager Role

We want to enable Alice to assign roles to users in her organization in a self-service manner.
To make this happen, we need give Alice an [Manager Role](https://docs.zitadel.com/docs/concepts/structure/managers) within the Organization `Demo-Customer`.

Still in the organization `Demo-Customer`, navigate to Organization. Click on the plus on the top right and give `Alice Admin` the Manager Role `Org Owner`.

## Step 5: Create a project grant

### Login

You should be able to login to the Demo Application with the user created in the organization `Demo-Customer`and see all granted projects.

Switch to authorizations to view all users and their roles. You may extend the application here to make role-assignment possible within the portal.

## What does it do?

Users with `view` role can view granted projects on their organization which were granted by your organization (owning this portal application).
Users with `admin` role can view granted projects and list users of the selected organization who are granted to use the portal application too.

![app screen](./public/screenshot.png)

### 1. Log into as a customer

Login with your user on the customer organization. You should have no granted projects and no roles in this organization.

### 2. Grant a project

In the `Demo-Vendor` delegate access management of the project `Portal` to `Demo-Customer` as described above. You don't see any other granted projects because the user is not authorized, yet.

The logout at this step is required as we use only the token's information and don't call the api. This might not be suitable in a production scenario.

### 3. Authorize a user for the granted project

Grant your user the role `reader` to the granted project `Portal`. Login again. You should see `Portal` in the tab "Granted Projects". You are not allowed to select the tab "Authorization", this is only for admins. You don't need to logout for the next step.

### 4. Grant and authorize another project

In the `B2B-Demo` delegate access management of the project `Data Cube` to `B2B-Demo-Customer` as described above. As soon as you granted the project, authorize your user to that project by assigning some roles. The new project should load on the Portal.

### 5. User Management

Give your user the `admin` role in addition to the `reader` role. Make sure you log off and log back in, to get the roles in the auth token. You should now be able to click on the tab "Authorization" and you see all users with authorization to the project `Portal`.  
This is how you can build your user management logic on top of the ZITADEL API.
