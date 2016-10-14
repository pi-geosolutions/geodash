# geodash

##Install

### Build webapp

    mvn clean install -DskipTests

### Build front-end

    cd src/main/webapp/dashboard
    npm install
    
   We also can install brunch as global (sudo npm install -g brunch and then use brunch bin directly)

    // public part    
    node_modules/brunch/bin/brunch b
    
    // private part
    node_modules/brunch/bin/brunch b -e private

## Run webapp on 8080
    mvn jetty:run

## Watch live
http://pigeo.fr:8080/geodash/dashboard/private/index.html

http://pigeo.fr:8080/geodash/dashboard/public/index.html

## Config
Edit DB settings in src/main/webapp/WEB-INF/db.properties
Change admin password in src/main/webapp/WEB-INF/security-applicationContext.xml

## On windows
Edit `.node_modules/angular-templates-brunch-next/lib/index.js` and add the line

    filepath = filepath.replace(/\\/g, '/');

To make filepath windows compatibles.