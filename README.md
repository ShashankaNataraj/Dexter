[![Build Status](https://travis-ci.org/ShashankaNataraj/Dexter.svg?branch=master)](https://travis-ci.org/ShashankaNataraj/Dexter)
[ ![Codeship Status for ShashankaNataraj/Dexter](https://codeship.com/projects/9942d770-2e5d-0134-1ca8-56aade007c2e/status?branch=master)](https://codeship.com/projects/163690)
[![Coverage Status](https://coveralls.io/repos/github/ShashankaNataraj/Dexter/badge.svg?branch=master)](https://coveralls.io/github/ShashankaNataraj/Dexter?branch=master)
[![Dependency status](https://david-dm.org/shashankanataraj/Dexter/status.png)](https://david-dm.org/cfogelberg/grunt-set-app-mode#info=dependencies&view=table)

### What is Dexter?
Dexter is a [HAR file](https://www.maxcdn.com/one/visual-glossary/har-file/) proxy server.

### Why Dexter?
Dexter is simple, very light weight and blazingly fast. Instead of running your entire development server on your machine, just run Dexter and point your Grunt / Gulp proxy server to it.

### Ok, I'm in, Whats the setup?
###### Generating a HAR file
Open your prod servers' URL in chrome with the inspector tab open. Browse around to all those screens which make XHR calls to all of your API's. Then save the entire set of calls as a HAR file. [This link has information on how to generate a HAR file](https://confluence.atlassian.com/kb/generating-har-files-and-analysing-web-requests-720420612.html)

###### Installing dexter

    <sudo> npm install -g dexter-mocks
    
###### Using dexter

    Options:
    -f, --f             Har file path
    -p, --p             Defaults to 1121 if no port arg is specified
    -v, --v             Trigger verbose mode
    
###### Example:
    dexter -f prodServerHar.har -p 3000 -v

### What inspired this project?
[EasyMock](https://github.com/CyberAgent/node-easymock)