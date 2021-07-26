import jwt
from datetime import timedelta, datetime, timezone
import requests
import sys
import argparse
from pathlib import Path
import json

def main():

    TOKEN_ENDPOINT = "https://api.zitadel.ch/oauth/v2/token"
    TOKEN_SCOPE = "openid profile urn:zitadel:iam:org:project:id:69234237810729019:aud" # Don't change this ID for ZITADEL Cloud, see https://docs.zitadel.ch/docs/apis/openidoauth/scopes#reserved-scopes
    JWT_AUDIENCE = "https://issuer.zitadel.ch"

    my_parser = argparse.ArgumentParser(description='Create JWT and exchange for OAuth Token')
    # Mandatory
    my_parser.add_argument('Path', metavar='path', type=str, help='path to service user json file')

    # Optional arguments
    my_parser.add_argument('-d', '--dry-run', action='store_true', help='output request instead of sending')
    my_parser.add_argument('-v', '--verbose', action='store_true', help='verbose output, be careful!')
    args = my_parser.parse_args()

    access_token, token_type, expires_in = get_token(args.Path, TOKEN_ENDPOINT, TOKEN_SCOPE, JWT_AUDIENCE, args.verbose, args.dry_run)

    print('Authorization: {} {}\r\nexpires at (UTC): {} ({}s)'.format(token_type, access_token, datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in), expires_in))


def get_token(path, token_url, token_scope, jwt_audience, verbose=False, dryrun=False): 

    # load key from json
    keyId, key, userId = serviceuser_json(path)

    # construct jwt
    jwt = key2jwt(keyId, userId, key, jwt_audience, verbose)

    # exchange jwt for access token
    access_token, token_type, expires_in = jwt2token(jwt, token_url, token_scope, dryrun)

    if verbose:
        print('Authorization: {} {}\r\nexpires at (UTC): {} ({}s)'.format(token_type, access_token, datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in), expires_in))

    return access_token, token_type, expires_in

def serviceuser_json(input_path): 
    path = Path(input_path)
    if not path:
        print('The path specified does not exist')
        sys.exit()

    with open(path, "r") as read_file: 
        data = json.load(read_file)
        if not data['type'] == 'serviceaccount':
            print('Not a service account')
            sys.exit()
    return data['keyId'], data['key'], data['userId']

def jwt2token(jwt, url, scope, dryrun=False):

    data = {
        'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer', 
        'scope': scope,
        'assertion': jwt
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    if dryrun: # Just construct the response, but don't send
        req = requests.Request('POST',url, headers, data=data)
        prepared = req.prepare()
        print('{}\n{}\r\n{}\r\n\r\n{}'.format(
            '-----------REQUEST START-----------',
            req.method + ' ' + req.url,
            '\r\n'.join('{}: {}'.format(k, v) for k, v in req.headers.items()),
            req.data,
        ))
    else:
        res = requests.post(url, data, headers=headers)
        if res.status_code == 200: 
            data = json.loads(res.text)
            return data['access_token'], data['token_type'], data['expires_in']
        else: 
            print(res.text)


def key2jwt(keyId, userId, private_key, audience, verbose=False):

    ALGORITHM = "RS256"

    utc = datetime.utcnow()

    iat_timestamp = utc + timedelta(minutes=60, seconds=5)
    exp_timestamp = iat_timestamp + timedelta(minutes=120)

    if verbose:
        print(iat_timestamp)

    body = {
        "aud": audience,
        "iss": userId,
        "sub": userId,
        "exp": int(exp_timestamp.timestamp()),
        "iat": int(iat_timestamp.timestamp())
    }

    headers = {
            'kid': keyId,
            'alg': ALGORITHM
    }

    encoded = jwt.encode(
        body,
        private_key, 
        algorithm=ALGORITHM, 
        headers=headers
        )
    if verbose: 
        print('body: {}\r\nkid: {}\r\nkey: {}\r\nencoded:{}\r\n\r\n'.format(body, headers, private_key, encoded))

    return encoded

if __name__ == '__main__':
    main()