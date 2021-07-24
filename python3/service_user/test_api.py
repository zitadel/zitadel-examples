import redis
import json
from datetime import timedelta
import time
import key2token
import requests
import argparse

## add clear-cache flag
my_parser = argparse.ArgumentParser(description='')
my_parser.add_argument('-nc', '--no-cache', action='store_true', help='Don\'t use cached tokens')
args = my_parser.parse_args()

r = redis.Redis('localhost')

if not r.exists("token") or args.no_cache:
    access_token, token_type, expires_in = key2token.fullmonty("./97182934515114009.json")

    r.setex(
        "token",
        timedelta(seconds=expires_in),
        json.dumps({"access_token":access_token, "token_type":token_type})
    )

print('ttl: {}'.format(r.ttl("token")))

token = json.loads(r.get("token"))

url = "https://api.zitadel.ch/management/v1/projects/_search"
data = {
    
}
headers = {
    'x-zitadel-orgid': '71641630146358541',
    'Authorization': '{} {}'.format(token['token_type'], token['access_token'])
}

res = requests.get(url, headers=headers)

print(res.text)