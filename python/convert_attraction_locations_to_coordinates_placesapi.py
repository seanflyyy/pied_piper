import requests
import json
import urllib
from pprint import pprint
import os
import firebase_admin
from firebase_admin import db
from firebase_admin import credentials

cred_obj = credentials.Certificate('code-exp-moh-database-firebase-adminsdk-tid9m-521af0320c.json')
default_app = firebase_admin.initialize_app(cred_obj, {
	'databaseURL': 'https://code-exp-moh-database-default-rtdb.asia-southeast1.firebasedatabase.app/'
	})

ref_initial = db.reference("/")
for key, value in ref_initial.get().items():
    if key == 'attractions':
        db.reference("/attractions").set({})

ref = db.reference("/attractions")

base_url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?'
AUTH_KEY = os.environ['Google_Geodecoder_API_Key']

json_file = requests.get("https://www.visitsingapore.com//content/desktop/en/singaporediscovers/vouchers/_jcr_content/par/book_directly_with_c.listing.json")
json_decoder = json_file.json()

location_list = []
location_dict = {}
location_list_dict = {}
count = 0

items = json_decoder['filterResults'][0]['items']

for item in items:
    name = item['heading']
    if name == "Time Capsule":
        pass
    else:
        parameters = {
        "key": AUTH_KEY,
        "input": f"{name}, Singapore",
        "inputtype": "textquery",
        "fields": "formatted_address,geometry,name,opening_hours,photos,types",
        }

        r = requests.get(f"{base_url}{urllib.parse.urlencode(parameters)}")
        data = json.loads(r.content)
        coordinates = {}
        coordinates.update({
            'latitude': data['candidates'][0]['geometry']['location']['lat'],
            'longitude': data['candidates'][0]['geometry']['location']['lng']
        })
        
        location_dict.update({'location': name,
                             'coordinate': coordinates,
                             'price': item['price'].strip('From </strong>SGD'),
                             'bookingLink': item['targetPath'],
                             'locationImage': f"visitsingapore.com{item['desktopImage']}",
                             'companyImage': f"visitsingapore.com{item['partnerLogoPath']}",
                             'type': data['candidates'][0]['types'],
                             })
        count += 1
        location_list_dict.update({f'attraction{count}':location_dict})
        #location_list.append(location_dict)
        location_dict = {}

#json_dict = {'results': location_list}
json_object = json.dumps(location_list_dict, indent = 4)
with open("events_finals.json", "w") as f:
    f.write(json_object)

with open("events_finals.json", "r") as f:
	file_contents = json.load(f)
for key, value in file_contents.items():
	ref.push().set(value)
pprint(location_list_dict)