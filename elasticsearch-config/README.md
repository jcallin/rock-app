# Initializing data

Use `pyhocon` (`npm install -g pyhocon`) to convert the `initial-data.conf` to json for storing, inserting to Elasticsearch, etc

`cat initial-data.conf | pyhocon -f json`