import requests
import json
import urllib
from pprint import pprint
import os

base_url= "https://maps.googleapis.com/maps/api/geocode/json?"
AUTH_KEY = os.environ['Google_Geodecoder_API_Key']

json_file = requests.get("https://www.visitsingapore.com/content/desktop/en/singaporediscovers/vouchers/_jcr_content/par/bau_deals_with_carou_154448693.listing.json")
json_decoder = json_file.json()

location_list = []
location_dict = {}

items = json_decoder['filterResults'][0]['items']

for item in items:
    name = item['heading']
    if name == "Time Capsule":
        pass
    else:
        parameters = {
        "address": f"{name}, Singapore",
        "key": AUTH_KEY,
        }
        r = requests.get(f"{base_url}{urllib.parse.urlencode(parameters)}")
        data = json.loads(r.content)
        coordinates = data['results'][0]['geometry']['location']
        coordinates.update({'latitude': coordinates['lat'],
                            'longitude': coordinates['lng'],})
        coordinates.pop('lat')
        coordinates.pop('lng')
        
        location_dict.update({'location': name,
                             'coordinate': coordinates,
                             'price': item['price'].strip('From </strong>SGD'),
                             'bookingLink': item['targetPath'],
                             'locationImage': f"visitsingapore.com{item['desktopImage']}",
                             'companyImage': f"visitsingapore.com{item['partnerLogoPath']}",})
        location_list.append(location_dict)
        location_dict = {}

json_dict = {'results': location_list}
json_object = json.dumps(json_dict, indent = 4)
with open("events.json", "w") as f:
    f.write(json_object)
pprint(location_list)