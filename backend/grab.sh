#!/bin/sh

# grab course data from UH, save to data.json
phantomjs --ssl-protocol=tlsv1 --ignore-ssl-errors=true run-uhfind-phntm.js 0

# save contents of data.json to mongodb
node run-uhfind-save.js

# grab course data from UH, save to data.json
phantomjs --ssl-protocol=tlsv1 --ignore-ssl-errors=true run-uhfind-phntm.js 1

# save contents of data.json to mongodb
node run-uhfind-save.js
