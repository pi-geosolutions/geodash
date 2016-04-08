# geodash

##Install

    cd src/main/webapp/geodash
    npm install
    brunch build -d brunch.coffee

##Run
    cd src/main/webapp/geodash
    python -mSimpleHTTPServer

## On windows
Edit `.node_modules/angular-templates-brunch-next/lib/index.js` and add the line

    filepath = filepath.replace(/\\/g, '/');

To make filepath windows compatibles.

Go to http://localhost:8000/geodash/public/#/users/1/indicators
