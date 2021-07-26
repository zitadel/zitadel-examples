# Python: Access ZITADEL API's with Service User

## Intro

Use `PyJWT` to create privately signed JWT token and access ZITADEL's Management API

## Setup Python
1. `python3 -m venv env` with version 3.8.5
2. `source env/bin/activate`
3. Confirm workdir with `which python`
4. `python3 -m pip install -r requirements.txt`

## Setup ZITADEL

1. Create service user key
https://docs.zitadel.ch/docs/guides/usage/serviceusers#exercise-create-a-service-user

2. Add service user as org manager
https://docs.zitadel.ch/docs/guides/usage/access-zitadel-apis#exercise-add-org_owner-to-service-user

3. Save service user key json as `service_user.json`

## Generate an auth token from privately signed JWT

`python3 key2token.py service_user.json`

## Retrieve all projects within your organization

`python3 test_api.py -orgid 71641630146358541`
