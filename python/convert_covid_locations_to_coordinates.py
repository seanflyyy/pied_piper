import PyPDF2
from pprint import pprint
import requests
import json
import urllib
import os

zenserp_headers = { 
  "apikey": os.environ['zenserp_api']}

base_url= "https://maps.googleapis.com/maps/api/geocode/json?"
AUTH_KEY = os.environ['Google_Geodecoder_API_Key']
pdf_file = PyPDF2.PdfFileReader(open('june15 locations.pdf', 'rb'))

page_line_range_dict = {
    0: [20, 272],
    1: [11, 300],
    2: [11, 300],
    3: [11, 61]
}
text_block_list = []
for page_num in range(pdf_file.numPages):
    pdf_page = pdf_file.getPage(page_num)
    text_list = pdf_page.extractText().split('\n')
    skip_to_next_index = 0
    for line_index in range(len(text_list)):
        if line_index < page_line_range_dict[page_num][0]:
            continue
        if line_index > page_line_range_dict[page_num][1]:
            break
        if line_index < skip_to_next_index:
            continue
        line = text_list[line_index]
        date = line
        look_ahead_index = 1
        look_ahead_line = text_list[line_index + look_ahead_index]
        while look_ahead_line[-1] != 'h' and not look_ahead_line[:3].isdigit():
            date += look_ahead_line
            look_ahead_index += 1
            look_ahead_line = text_list[line_index + look_ahead_index]
        time = text_list[line_index + look_ahead_index]
        look_ahead_index += 1
        look_ahead_line = text_list[line_index + look_ahead_index]
        while time.strip()[-1] != 'h':
            time += look_ahead_line
            look_ahead_index += 1
            look_ahead_line = text_list[line_index + look_ahead_index]
        look_ahead_index += 1
        location = text_list[line_index + look_ahead_index]
        look_ahead_index += 1
        look_ahead_line = text_list[line_index + look_ahead_index]
        while True:
            if len(look_ahead_line.strip()) <= 2:
                try:
                    int(look_ahead_line)
                    if ('Jun' in text_list[line_index + look_ahead_index + 1] or 'to ' in text_list[line_index + look_ahead_index + 1] or
                        'Jun' in text_list[line_index + look_ahead_index + 2] or 'to ' in text_list[line_index + look_ahead_index + 2] or
                        text_list[line_index + look_ahead_index + 2] == 'J' or text_list[line_index + look_ahead_index + 1] == 'to'):
                        break
                except ValueError:
                    pass
            if ' Jun' in look_ahead_line or ' to ' in look_ahead_line:
                break
            if (line_index + look_ahead_index) > page_line_range_dict[page_num][1]:
                break
            location += look_ahead_line
            look_ahead_index += 1
            try:
                look_ahead_line = text_list[line_index + look_ahead_index]
            except IndexError:
                break
        text_block_list.append({'date': date.strip(), 'time': time.strip(), 'location': location.strip()})
        skip_to_next_index = line_index + look_ahead_index

location_count_dict = {}
for event in text_block_list:
    try:
        location_close_bracket_index = event['location'].index(')')
        location = event['location'][:location_close_bracket_index + 1]
    except ValueError:
        location = event['location']
    event['location'] = location
    
    if location == 'VivoCity (1 Harbourfront Walk)':
        location = 'VivoCity'
        
    date = event['date']
    time = event['time']
    if location not in location_count_dict.keys():
        location_count_dict[location] = {}
        location_count_dict[location]['count'] = 1
        location_count_dict[location]['list_of_dates'] = [(date, time)]
    else:
        location_count_dict[location]['count'] = location_count_dict[location]['count'] + 1
        location_count_dict[location]['list_of_dates'].append((date, time))

unique_location_json_list = []
for location in location_count_dict:
    zenserp_params = (
        ("q",location),
        ("tbm","isch"),
        )
    parameters = {
        "address": f"{location}",
        "key": AUTH_KEY,
        }
    zenserp_response = requests.get('https://app.zenserp.com/api/v2/search', headers=zenserp_headers, params=zenserp_params)
    image_url = zenserp_response.json()['image_results'][0]['sourceUrl']
    
    r = requests.get(f"{base_url}{urllib.parse.urlencode(parameters)}")
    data = json.loads(r.content)
    coordinates = data['results'][0]['geometry']['location']

    coordinates.update({'latitude': coordinates['lat'],
                        'longitude': coordinates['lng'],})
    coordinates.pop('lat')
    coordinates.pop('lng')
    
    count = location_count_dict[location]['count']
    list_of_dates = location_count_dict[location]['list_of_dates']

    unique_location_json_list.append({'count': count,
                                      'location': location,
                                      'image_url': image_url,
                                      'coordinates': coordinates,
                                      'list_of_dates': list_of_dates,
                                      })

json_result = {'result': unique_location_json_list,
               'source': 'https://drive.google.com/file/d/1YjJrzO38SupGZ3_EQv_pt330JNptN86s/view'}
with open('covid_locations.json', 'w') as f:
    f.write(json.dumps(json_result, indent = 4))
    
pprint(unique_location_json_list)


