import requests
from bs4 import BeautifulSoup
from pprint import pprint
import re


def scrape_moh_covid():
    page = requests.get("https://www.moh.gov.sg/covid-19")
    soup = BeautifulSoup(page.content, 'html.parser')

    keyword_dict = {'Total Number of Imported Cases in Singapore': {'imported_cases_date': 0, 'imported_cases': 3,
                                                                    'imported_cases_change': 4},
                    'Case Summary in Singapore': {'cases_date': 0},
                    'Active Cases': {'active_cases': 0},
                    'Discharged': {'discharged': 0},
                    'In Community Facilities': {'in_community_facilities': 1},
                    'Hospitalised (Stable)': {'hospitalised_stable': 1},
                    'Hospitalised (Critical)': {'hospitalised_critical': 1},
                    'Deaths': {'deaths': 1},
                    'Received at least First Dose': {'vax_first_dose': 1},
                    'Completed Full Vaccination Regimen': {'full_vax': 1},
                    'Total Doses Administered': {'total_vax': 1},
                    'Total Swabs Tested': {'total_swab': 1},
                    'Average Daily Number of Swabs Tested Over The Past Week': {'avg_daily_swab': 1},
                    'Total Swabs Per 1,000,000 Total Population': {'total_swab_one_mil': 1}}
    json_result = {}

    data_block = soup.find_all(class_="sfContentBlock")

    for index in range(len(data_block)):
        header = soup.find_all(class_="sfContentBlock")[index].get_text().replace(' ', ' ')
        for keyword in keyword_dict:
            if keyword == header[:len(keyword)]:
                for key in keyword_dict[keyword]:
                    json_result[key] = soup.find_all(class_="sfContentBlock")[index].find_all("span")[
                        keyword_dict[keyword][key]].get_text().replace(' ', ' ')

    formatter_dict = {'imported_cases_date': r'\(as at (.+),.+\)',
                      'imported_cases_change': r'\((.+)\)',
                      'cases_date': r'\(as at (.+),.+\)'}
    for key in formatter_dict:
        json_result[key] = re.search(formatter_dict[key], json_result[key]).group(1)

    pprint(json_result)
    return json_result


scrape_moh_covid()
