#### 1.0.3

##### Bug Fixes

- issue with manipulated bundles from static not having cache headers on their response (9e59ca8d)

#### 1.0.2

##### Bug Fixes

- prevent using relative paths to locate assets in a consumer project (d8cbe564)

#### 1.0.1

##### New Features

- export redux store object in /redux subpackage (82db686e)
- new server startup options staticRoutePath and staticRoutePaths[] so an array of static route paths can be defined to serve up static assets from staticFolderPath. STATIC_PATH and STATIC_ROUTE_PATH are recommended in .env file can be used exclusively or together (df990169)
- adds new server start option to allow custom folder path and filename for static/startup.js (2c9ad565)
- support for a new server startup option of "staticFolderPath" this is not required initially as everything should default to 'static' path (b4356e17)
- use react-helmet to generate the html tag server side if htmlAttributes are specified in the consuming app (ad466706)
- add UPDATE_LOADING_STATE action to reset isLoading state when app has entry (79377ab0)

##### Bug Fixes

- add node.entry.language to the routing query (5247fb75)
- set default folder path when serving static assets (cb9b2aef)
- variable access issue (a61bd07e)
- update search package to latest containing fixes and other tweaks (e8703763)
- remove uneeded toJs (975a17b5)

##### Other Changes

- add support for a nodeOptions object supplied with a ContentTypeMapping to specify details for fetching children for a route entry's contentTypeId (87a1302d)
- opportunity to reduce some of the excess code and add additional comments to webApp.js, remove redundant patch (0b7e0269)
- remove feature to automatically exclude the current route entry id in any minilist search, instead expect the consumer to provide the current route entry id in the options if they require the current page to be excluded from minilist results (98282648)

##### Performance Improvements

- remove unused packages, remove old webpack build script, update jsonpath-mapper to latest version (22323612)

##### Refactors

- remve superfluos header with Neil’s guidance (918d2e22)