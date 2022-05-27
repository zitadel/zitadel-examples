ZITADEL Example Project with Spring Boot and Spring Security
----

This example contains two Spring Boot Apps (`app` and `api`) which use the [ZITADEL](https://zitadel.ch/) IdP as OpenID Provider.
The app `web` uses the internal OAuth2 access token (opaque token) provided by ZITADEL to access the `api` which acts as a OAuth2 resource server.

# Features
- OpenID Connect based Login
- Logout support via OpenID Connect end session endpoint
- Access Token Relay
- Opaque Reference Tokens and Token Introspection

# Applications

## Web

The Spring Boot app `web` is configured as confidential Web App and OpenID Connect client in ZITADEL and uses the Spring Security OAuth2 client library
for authentication.

Base URL: `http://localhost:18080/webapp`
Redirect URL: `http://localhost:18080/webapp/login/oauth2/code/zitadel`
Post Logout URL: `http://localhost:18080/webapp`

## API

The Spring Boot app `api` is configured as an API in ZITADEL and uses the Spring Security Resource Server support.

Base URL: http://localhost:18090

# Build

```
mvn clean package -DskipTests
```

# Run

API:
```
java \
  -Dspring.security.oauth2.resourceserver.opaquetoken.client-id=xxx \
  -Dspring.security.oauth2.resourceserver.opaquetoken.client-secret=xxxx \
  -jar api/target/api-0.0.1-SNAPSHOT.jar
```

WEB:
```
java \
  -Dspring.security.oauth2.client.registration.zitadel.client-id=xxx \
  -Dspring.security.oauth2.client.registration.zitadel.client-secret=xxx \
  -jar web/target/web-0.0.1-SNAPSHOT.jar 
```

# Configuration

## ZITADEL

![Client Configurations](spring-boot-zitadel-config.png)

![Web App Configurations](spring-boot-zitadel-config-web-app2.png)

![API App Configurations](spring-boot-zitadel-config-api-app.png)

## Spring

The `web` application requires the following JVM Properties to be configured:
```
-Dspring.security.oauth2.client.registration.zitadel.client-id=...web-client-id
-Dspring.security.oauth2.client.registration.zitadel.client-secret=...web-client-secret
```

The `api` application requires the following JVM Properties to be configured:
```
-Dspring.security.oauth2.resourceserver.opaquetoken.client-id=...api-client-id
-Dspring.security.oauth2.resourceserver.opaquetoken.client-secret=...api-client-secret
```

# Misc

- This example uses opaque reference tokens as access tokens
- For the sake of simplicity CSRF protection and https are disabled
- Note in order to allow `http://` URIs we need to enable the `development mode in the respective client configuration.