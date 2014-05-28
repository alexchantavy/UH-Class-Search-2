#!/bin/sh

# grab course data from UH, save to data.json
phantomjs --ssl-protocol=tlsv1 --ignore-ssl-errors=true run-uhfind-phntm.js

# save contents of data.json to mongodb
node run-uhfind-save.js
