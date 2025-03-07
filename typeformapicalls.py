import requests

base_url = "https://api.typeform.com/"

api_token = 'tfp_4ZR1JR6KrCQV4T6HZv5bfH5hjCSeS3SLr1xGNnLuGHZ8_3mNXhWyoyfB1Wp'

requests.get(base_url, headers={'Authorization': 'Bearer ' + api_token})