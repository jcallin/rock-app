import requests, json, os
from elasticsearch import Elasticsearch
from pyhocon.converter import HOCONConverter

# Imports some default data to a local Elasticsearch index 'terms' available at port 9200
# It first converts initial-data.conf to json, and then takes each item in the json list and loads it to the db
index_name = "terms"

template_file = 'initial-template.json'

input_file = 'initial-data.conf'
output_file = 'initial-data.json'

HOCONConverter.convert_from_file(input_file=input_file, output_file=output_file, output_format='json', indent=2, compact=False)

es = Elasticsearch([{'host': 'localhost', 'port': '9200'}])

with open(output_file) as json_data:
    documents = json.load(json_data)[index_name]
    print(f"Loading {len(documents)} documents into Elasticsearch in index {index_name} using template {template_file}")
    with open(template_file) as template:
        es.indices.put_template(name="terms_template", body=template.read())
    for document in documents:
        es.index(index=index_name, body=document)