# ZitadelAngularTemplate

This is our Zitadel Angular Template. If shows how to authenticate as a user and retrieve user information from the OIDC endpoint.

<img width="790" alt="template" src="https://user-images.githubusercontent.com/10165752/110756388-6ba37f80-824a-11eb-841a-411a49d9588b.png">

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.1.

## Run with zitadel.cloud

To run the example you need to create your ZITADEL instance. If you not already have go to zitadel.cloud register yourself and create your first instance.

1. Create ZITADEL instance on zitadel.cloud
2. Login to your ZITADEL instance and create an app according to: https://docs.zitadel.com/docs/quickstarts/login/angular
3. Go to app.module.ts
    1. Replace <YOUR DOMAIN> (4 times) with the domain of your own ZITADEL instance
    2. Replace <YOUR APPS CLIENT ID HERE> (once) with the client id created in the app in step 2 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
