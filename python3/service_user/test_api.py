import json
from datetime import timedelta
import time
import key2token
import requests
import argparse

from beaker.cache import CacheManager
from beaker.util import parse_cache_config_options

cache_opts = {
    'cache.type': 'file',
    'cache.data_dir': '/tmp/cache/data',
    'cache.lock_dir': '/tmp/cache/lock'
}
cache = CacheManager(**parse_cache_config_options(cache_opts))

@cache.cache('token_func', expire=3600)
def auth_header(): 
    access_token, token_type, expires_in = key2token.get_token("./service_user.json")
    return '{} {}'.format(token_type, access_token)


## add clear-cache flag
my_parser = argparse.ArgumentParser(description='')
my_parser.add_argument('-nc', '--no-cache', action='store_true', help='Don\'t use cached tokens')
my_parser.add_argument('-d', '--dry-run', action='store_true', help='output request instead of sending')
args = my_parser.parse_args()

url = "https://api.zitadel.ch/management/v1/projects/_search"
data = {
}

headers = {
    'x-zitadel-orgid': '71641630146358541',
    'Authorization': auth_header()
}

if args.dry_run: # Just construct the response, but don't send
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
    print('Status: {}, Response: {}'.format(res.status_code, res.text))