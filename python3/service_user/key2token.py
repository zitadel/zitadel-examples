import jwt
from datetime import timedelta, datetime, timezone
import requests
import sys
import argparse
from pathlib import Path
import json

def main():

    my_parser = argparse.ArgumentParser(description='Create JWT and exchange for OAuth Token')
    # Mandatory
    my_parser.add_argument('Path', metavar='path', type=str, help='path to service user json file')
    # Optional arguments
    my_parser.add_argument('-d', '--dry-run', action='store_true', help='output request instead of sending')
    my_parser.add_argument('-v', '--verbose', action='store_true', help='verbose output, be careful!')
    args = my_parser.parse_args()

    opt_dryrun = True if args.dry_run else False
    opt_verbose = True if args.verbose else False

    access_token, token_type, expires_in = get_token(args.Path, opt_verbose, opt_dryrun)

    print('Authorization: {} {}\r\nexpires at (UTC): {} ({}s)'.format(token_type, access_token, datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in), expires_in))


def get_token(path, verbose=False, dryrun=False): 

    # load key from json
    keyId, key, userId = serviceuser_json(path)

    # construct jwt
    jwt = key2jwt(keyId=keyId, userId=userId, key=key, verbose=verbose)

    # exchange jwt for access token
    access_token, token_type, expires_in = jwt2token(jwt, dryrun)

    if verbose:
        print('Authorization: {} {}\r\nexpires at (UTC): {} ({}s)'.format(token_type, access_token, datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in), expires_in))

    return access_token, token_type, expires_in

    # TODO url, aud, scope via cmdline 
    # ... via config file
    # import script and watch expiry

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

def jwt2token(jwt, dryrun=False):

    url = "https://api.zitadel.ch/oauth/v2/token"
    data = {
        'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer', 
        'scope': 'openid profile urn:zitadel:iam:org:project:id:69234237810729019:aud',
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


def key2jwt(keyId, userId, key, verbose=False):

    private_key = key

    iat_timestamp = datetime.utcnow() + timedelta(seconds=5)
    exp_timestamp = iat_timestamp + timedelta(minutes=120)

    print(iat_timestamp)

    body = {
        "aud": "https://issuer.zitadel.ch",
        "iss": userId,
        "sub": userId,
        "exp": int(exp_timestamp.timestamp()),
        "iat": int(iat_timestamp.timestamp())
    }

    headers = {
            'kid': keyId,
            'alg': "RS256"
    }

    encoded = jwt.encode(
        body,
        private_key, 
        algorithm="RS256", 
        headers=headers
        )
    if verbose: 
        print('body: {}\r\nkid: {}\r\nkey: {}\r\nencoded:{}\r\n\r\n'.format(body, headers, key, encoded))

    return encoded

if __name__ == '__main__':
    main()