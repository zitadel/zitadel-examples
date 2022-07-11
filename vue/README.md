---
title: Vue Zitadel OIDC client example
---

This integration guide shows you the recommended way to integrate ZITADEL into your Vue application.
It shows how to add user login to your application and fetch some data from the user info endpoint.

At the end of the guide, your application has login functionality and has access to the current user's profile.

> This documentation refers to our [example](https://github.com/zitadel/zitadel-examples) in GitHub. Note that we've written ZITADEL Console in Vue, so you can also use that as a reference.

## Setup Application and Get Keys

Before we can start building our application, we have to do a few configuration steps in ZITADEL Console.
You will need to provide some information about your app. We recommend creating a new app to start from scratch. Navigate to your Project, then add a new application at the top of the page.
Select Web application type and continue.
We recommend you use [Authorization Code](../../apis/openidoauth/grant-types#authorization-code) in combination with [Proof Key for Code Exchange (PKCE)](../../apis/openidoauth/grant-types#proof-key-for-code-exchange) for all web applications.

![Create app in console](./public/readme/app-create.png)

### Redirect URIs

With the Redirect URIs field, you tell ZITADEL where it is allowed to redirect users to after authentication. For development, you can set dev mode to `true` to enable insecure HTTP and redirect to a `localhost` URI.

> If you are following along with the [example](https://github.com/zitadel/zitadel-examples), set dev mode to `true` and the Redirect URIs to the following:

http://localhost:3000/auth/signinwin/main

http://localhost:3000/auth/signinpop/main

http://localhost:3000/auth/signinsilent/main


If you want to redirect the users back to a route on your application after they have logged out, add an optional redirect in the Post Logout URIs field.

Set Post Logout URIs to the following:

http://localhost:3000/auth/signoutpop/main

http://localhost:3000/

Continue and create the application.

### Client ID

After successful app creation, a pop-up will appear, showing the app's client ID. Copy the client ID, as you will need it to configure your Vue client.

## Vue Setup

Now that you have your web application configured on the ZITADEL side, you can go ahead and integrate your Vue client.

### Install Vue Dependencies

You need to install an OAuth / OIDC client to connect with ZITADEL. Run the following command:

```bash
yarn add vue-oauth2-oidc
```

### Configure OIDC

Create oidc Folder under /src and extract the files from this [folder](./public/readme/oidc.zip)

### Create .env
VUE_APP_ZITADEL_AUTHORITY=

VUE_APP_ZITADEL_CLIENT_ID=

### Modify main.ts

```
import idsrvAuth from "./oidc/idsrvAuth";

idsrvAuth.startup().then(ok => {
  if (ok) {
    const i18nConfig = {
      locale: "en",
      fallbackLocale: "en",
      messages: {
        en: require("@/i18n/en.json"),
        cn: require("@/i18n/cn.json"),
        es: require("@/i18n/es.json"),
        ir: require("@/i18n/ir.json"),
        br: require("@/i18n/br.json")
      }
    };
    const app = createApp(App);
    ...
    app.config.globalProperties.$oidc = idsrvAuth;
    app.mount("#app");
  } else {
    console.log("Startup was not ok");
  }
});
```

### Modify router
Add the import
```ts
import idsrvAuth from "../oidc/idsrvAuth";
```

Add the meta.authName to Protected Routes following to protected routes
```ts
name: "admin",
path: "/admin",
meta: {
  authName: idsrvAuth.authName
},
```

Add useRouter from idsrvAuth
```ts
idsrvAuth.useRouter(router);
export default router;
```

### login

The app automatically opens the login window from ZITADEL when accessing a protected route

### Add Logout to Your Application

Call `$oidc.signOut` for logging the current user out. Note that you can also configure a logout redirect URI if you want your users to be redirected after logout.


### Show User Information

To fetch user data, ZITADEL's user info endpoint has to be called. This data contains sensitive information and artifacts related to the current user's identity and the scopes you defined in your _AuthConfig_.
Our _AuthenticationService_ already includes a method called _getOIDCUser()_. You can call it wherever you need this information.

User data is stored in $oidc.userProfile. This data contains sensitive information and artifacts related to the current user's identity.
You can access the global variable wherever you need this information.
```ts
export default {
  computed: {
    user() {
      return { ...this.$oidc.userProfile, accessToken: this.$oidc.accessToken }
    },
  }
}
```

And in your template:

```ts
<template>
  {{user.name}}
</template>
```

## Completion

You have successfully integrated your Vue application with ZITADEL!

If you get stuck, consider checking out our [example](https://github.com/zitadel/zitadel-examples) application. It includes all the mentioned functionality of this quickstart. You can simply start by cloning the repository and replacing the .env variables in the by your own configuration. If you run into issues, contact us or raise an issue on [GitHub](https://github.com/zitadel/zitadel).
