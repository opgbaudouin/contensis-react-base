import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import 'immutable';
import { b as selectCurrentProject, o as setRoute } from './selectors-10d55d92.js';
import 'query-string';
import { a as selectBuildNumber, b as selectCommitRef, s as selectVersionStatus } from './selectors-0213acd7.js';
import mapJson, { jpath } from 'jsonpath-mapper';
export { jpath, default as mapJson } from 'jsonpath-mapper';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

/**
 *
 * @param {object} json The source object we wish to transform
 * @param {object} template The mapping template we wish to apply to the source
 * object to generate the intended target object
 */

const useMapper = (json, template) => {
  return template ? mapJson(json || {}, template) : json;
};

const chooseMapperByFieldValue = (entry, mappers, field = 'sys.contentTypeId') => {
  const fieldValue = jpath(field, entry || {});
  return mappers[fieldValue] || mappers['default'] || {};
};
/**
 * useEntriesMapper hook to take a list of entries from Delivery API along
 * with mappers for each contentTypeId and return an array of mapped objects
 * @param {any} entry The source entry we wish to transform
 * @param {object} mappers Object with keys containing mapper templates,
 * the key name matching sys.contentTypeId
 * @param {string} field Only include if we need to match content based on
 * a field other than sys.contentTypeId in the source data
 * @returns {object} Object transformed using a matched content type or
 * a default mapper template, returns an empty object if no mapper template
 * couild be applied.
 */


const useEntriesMapper = (entry, mappers, field = 'sys.contentTypeId') => {
  const mapper = chooseMapperByFieldValue(entry, mappers, field);
  return useMapper(entry || {}, mapper);
};
/**
 * Deprecated: due to misleading name, use the hook useEntriesMapper instead
 */

const useEntryMapper = useEntriesMapper;
/**
 * mapEntries mapping function to take a list of entries from Delivery API along
 * with mappers for each contentTypeId and return an array of mapped objects
 * @param {any} entry The source entry we wish to transform
 * @param {object} mappers Object with keys containing mapper templates,
 * the key name matching sys.contentTypeId
 * @param {string} field Only include if we need to match content based on
 * a field other than sys.contentTypeId in the source data
 * @returns {object} Object transformed using a matched content type or
 * a default mapper template, returns an empty object if no mapper template
 * couild be applied.
 */

const mapEntries = (entries, mappers, field = 'sys.contentTypeId') => entries.map(entry => {
  const mapper = chooseMapperByFieldValue(entry, mappers, field);
  return mapper ? mapJson(entry || {}, mapper) : entry;
});
/**
 * mapComposer mapping function to take a composer field from Delivery API along
 * with mappers for each Composer Item "type" and return an array of mapped components
 * @param {array} composer Composer field array of Composer Items
 * @param {object} mappers A keyed object with each key matching the Composer Item "type"
 * @returns {array} Array of mapped objects transformed using a matched Composer Item "type" mapping
 * or null. Injects a "_type" property into each transformed object in the array to indicate
 * where the mapping originated and for what component the mapped object is representing
 */

const mapComposer = (composer, mappers) => Array.isArray(composer) ? composer.map(composerItem => {
  const fieldValue = composerItem.type;
  const mapper = mappers[fieldValue] || mappers['default'];
  return mapper ? {
    _type: fieldValue,
    ...mapJson(composerItem.value || {}, mapper)
  } : composerItem;
}) : null;
/**
 * useComposerMapper hook to take a composer field from Delivery API along
 * with mappers for each Composer Item "type" and return an array of mapped components
 * @param {array} composer Composer field array of Composer Items
 * @param {object} mappers A keyed object with each key matching the Composer Item "type"
 * @returns {array} Array of mapped objects transformed using a matched Composer Item "type" mapping
 * or null. Injects a "_type" property into each transformed object in the array to indicate
 * where the mapping originated and for what component the mapped object is representing
 */

const useComposerMapper = (composer = [], mappers = {}) => mapComposer(composer, mappers);

const setCachingHeaders = (response, {
  cacheControl = 'private',
  surrogateControl = '3600'
}, method = 'header') => {
  if (cacheControl) response[method]('Cache-Control', cacheControl);
  if (surrogateControl) response[method]('Surrogate-Control', `max-age=${surrogateControl.toString()}`);
};

var setCachingHeaders_1 = setCachingHeaders;

const stringifyStrings = obj => {
  const returnObj = Array.isArray(obj) ? [] : {};
  Object.entries(obj).forEach(([key, value]) => {
    switch (typeof value) {
      case 'string':
        returnObj[key] = JSON.stringify(value);
        break;

      case 'object':
        returnObj[key] = stringifyStrings(value);
        break;

      default:
        returnObj[key] = value;
        break;
    }
  });
  return returnObj;
};

var stringifyStrings_1 = stringifyStrings;

const url = (alias, project) => {
  const projectAndAlias = project && project.toLowerCase() != 'website' ? `${project.toLowerCase()}-${alias}` : alias;
  return {
    api: `https://api-${alias}.cloud.contensis.com`,
    cms: `https://cms-${alias}.cloud.contensis.com`,
    liveWeb: `https://live-${projectAndAlias}.cloud.contensis.com`,
    previewWeb: `https://preview-${projectAndAlias}.cloud.contensis.com`,
    iisWeb: `https://iis-live-${projectAndAlias}.cloud.contensis.com`,
    iisPreviewWeb: `https://iis-preview-${projectAndAlias}.cloud.contensis.com`
  };
};

var urls = url;

var name = "zengenti-isomorphic-base";
var version = "2.0.1-beta.0";
var repository = "https://gitlab.zengenti.com/ps-projects/zengenti-base/zen-base/tree/isomorphic-base";
var license = "None";
var description = "";
var main = "cjs/contensis-react-base.js";
var module$1 = "esm/contensis-react-base.js";
var config = {
	startup: ""
};
var scripts = {
	start: "cross-env NODE_ENV=development webpack-dev-server --config webpack/webpack.config.dev.js",
	build: "rimraf ./dist && cross-env NODE_ENV=production parallel-webpack --config webpack/webpack.config.prod.js && npm run build:startup",
	"build:startup": "node node_modules/zengenti-buildstartup-package",
	server: "node --max-http-header-size=800000 dist/start.js",
	"dev:server": "cross-env NODE_ENV=test NODE_OPTIONS=--max-http-header-size=80000 babel-node --inspect=9229 src/server/debug.js",
	"debug:server": "nodemon --exec cross-env NODE_ENV=test NODE_OPTIONS=--max-http-header-size=80000 babel-node --inspect=9229 src/server/debug.js",
	"build:server": "npm run build && npm run server",
	"build:lib": "npm run roll:lib",
	"roll:lib": "rimraf ./esm && rimraf ./cjs && cross-env NODE_ENV=production rollup -c rollup/rollup.config.lib.js",
	postinstall: "patch-package",
	lint: "eslint .",
	"lint:fix": "eslint --fix .",
	"test:generate-output": "jest --json --outputFile=.jest-test-results.json || true",
	test: "jest  -c ./config/jest.config.js --detectOpenHandles --forceExit",
	"test:watch": "jest --config=./config/jest.config.js --watch",
	"test:coverage": "jest --config=./config/jest.config.js --coverage",
	"publish:test": "npm pack && tar -xvzf *.tgz && rm -rf package *.tgz"
};
var keywords = [
];
var author = "http://Zengenti.com";
var devDependencies = {
	"@babel/cli": "7.4.4",
	"@babel/core": "7.4.5",
	"@babel/node": "^7.4.5",
	"@babel/plugin-proposal-class-properties": "7.4.4",
	"@babel/plugin-proposal-export-default-from": "^7.2.0",
	"@babel/plugin-proposal-export-namespace-from": "^7.10.4",
	"@babel/plugin-syntax-dynamic-import": "7.2.0",
	"@babel/plugin-transform-classes": "^7.5.5",
	"@babel/plugin-transform-regenerator": "^7.4.5",
	"@babel/plugin-transform-runtime": "^7.6.2",
	"@babel/preset-env": "7.4.5",
	"@babel/preset-react": "7.0.0",
	"@rollup/plugin-alias": "^3.1.1",
	"@rollup/plugin-babel": "^5.2.1",
	"@rollup/plugin-commonjs": "^15.0.0",
	"@rollup/plugin-json": "^4.1.0",
	"@rollup/plugin-node-resolve": "^9.0.0",
	"@testing-library/jest-dom": "^4.1.0",
	"@testing-library/react": "^9.1.4",
	"@zengenti/contensis-react-base": "^2.0.1",
	"babel-eslint": "^10.0.3",
	"babel-loader": "8.0.6",
	"babel-plugin-dynamic-import-node": "2.2.0",
	"babel-plugin-module-resolver": "^3.2.0",
	"babel-plugin-prismjs": "^1.0.2",
	"babel-plugin-styled-components": "1.10.0",
	"babel-plugin-transform-define": "^1.3.1",
	"browser-sync": "^2.26.7",
	"browser-sync-webpack-plugin": "2.2.2",
	chai: "^4.2.0",
	"chai-http": "^4.2.1",
	"clean-webpack-plugin": "0.1.19",
	"copy-webpack-plugin": "^6.2.1",
	"core-js": "^3.6.4",
	"cross-env": "^5.2.0",
	"css-loader": "^3.0.0",
	eslint: "^6.5.1",
	"eslint-config-prettier": "^6.4.0",
	"eslint-import-resolver-webpack": "^0.11.1",
	"eslint-loader": "^3.0.2",
	"eslint-plugin-flowtype": "3.10.1",
	"eslint-plugin-import": "^2.18.2",
	"eslint-plugin-jsx-a11y": "^6.2.3",
	"eslint-plugin-prettier": "^3.1.1",
	"eslint-plugin-react": "^7.16.0",
	"eslint-plugin-react-hooks": "^2.5.0",
	"friendly-errors-webpack-plugin": "1.7.0",
	"html-webpack-plugin": "3.2.0",
	"image-webpack-loader": "^5.0.0",
	"imagemin-webpack-plugin": "^2.4.2",
	jest: "^24.9.0",
	mocha: "^6.1.4",
	nodemon: "^1.19.1",
	"parallel-webpack": "^2.6.0",
	prettier: "1.18.2",
	"react-password-strength": "^2.4.0",
	rimraf: "^3.0.2",
	rollup: "^2.26.11",
	"rollup-plugin-peer-deps-external": "^2.2.3",
	"rollup-plugin-postcss": "^3.1.8",
	stylelint: "^11.0.0",
	"stylelint-config-recommended": "^3.0.0",
	"stylelint-config-styled-components": "^0.1.1",
	"stylelint-custom-processor-loader": "0.6.0",
	"stylelint-processor-styled-components": "1.8.0",
	webpack: "^4.37.0",
	"webpack-bundle-analyzer": "^4.3.0",
	"webpack-cli": "^3.3.11",
	"webpack-dev-server": "^3.7.1",
	"webpack-merge": "4.2.1",
	"webpack-module-nomodule-plugin": "^0.3.1",
	"webpack-modules": "^1.0.0",
	"webpack-node-externals": "1.7.2",
	"zengenti-buildstartup-package": "0.0.13",
	"zengenti-search-package": "git+https://gitlab+deploy-token-5:XKRGRE1p2PrFAxnWwLNz@gitlab.zengenti.com/zengenti-packages/search.git#develop"
};
var dependencies = {
	"@hot-loader/react-dom": "16.11.0",
	"await-to-js": "^2.1.1",
	"contensis-delivery-api": "^1.1.5-rc.1",
	"contensis-management-api": "^1.0.1",
	"custom-env": "^2.0.1",
	dateformat: "^3.0.3",
	express: "^4.17.1",
	"file-loader": "^4.0.0",
	fs: "0.0.1-security",
	"http-proxy": "^1.17.0",
	immer: "^8.0.1",
	immutable: "^4.0.0-rc.12",
	"isomorphic-fetch": "^3.0.0",
	"js-cookie": "^2.2.1",
	"jsonpath-mapper": "^1.1.0-beta.0",
	loglevel: "^1.6.3",
	"minify-css-string": "1.0.0",
	"oidc-client": "^1.5.4",
	"patch-package": "^6.2.2",
	"query-string": "^5.1.1",
	react: "16.11.0",
	"react-dom": "16.11.0",
	"react-helmet": "5.2.1",
	"react-hot-loader": "^4.11.0",
	"react-loadable": "5.5.0",
	"react-redux": "7.1.0",
	"react-router-config": "^5.1.1",
	"react-router-dom": "^5.1.1",
	"react-router-hash-link": "^2.2.2",
	redux: "^4.0.4",
	"redux-immutable": "^4.0.0",
	"redux-saga": "^1.0.3",
	"redux-thunk": "2.3.0",
	"regenerator-runtime": "0.13.2",
	reselect: "^4.0.0",
	"serialize-javascript": "1.7.0",
	sitemap: "^4.1.1",
	"styled-components": "^4.3.2",
	xxhashjs: "^0.2.2"
};
var packagejson = {
	name: name,
	version: version,
	repository: repository,
	license: license,
	description: description,
	main: main,
	module: module$1,
	config: config,
	scripts: scripts,
	keywords: keywords,
	author: author,
	devDependencies: devDependencies,
	dependencies: dependencies
};

const StyledTable = styled.table.withConfig({
  displayName: "VersionInfo__StyledTable",
  componentId: "sc-3rwmuu-0"
})(["font-family:'Fira Sans','Source Sans Pro',Helvetica,Arial,sans-serif;font-size:1rem;line-height:1.5rem;border-bottom:4px solid #8892bf;border-collapse:separate;margin:0 auto;width:80%;th{text-align:left;background-color:#c4c9df;border-bottom:#8892bf 2px solid;border-bottom-color:#8892bf;border-top:20px solid #fff;}td{border-bottom:1px solid #eee;}td,th{padding:0.5rem 0.75rem;vertical-align:top;}.left{width:25%;}tr th{border-right:hidden;border-spacing:0 15px;}.green{background-color:#9c9;border-bottom:1px solid #696;}.red{background-color:#c99;border-bottom:1px solid #966;}"]);

const VersionInfo = ({
  project,
  version,
  setRoute
}) => {
  const config = {
    deliveryApi: DELIVERY_API_CONFIG
    /* global DELIVERY_API_CONFIG */
    ,
    disabeSsrRedux: DISABLE_SSR_REDUX
    /* global DISABLE_SSR_REDUX*/
    ,
    servers: SERVERS
    /* global SERVERS */
    ,
    projects: PROJECTS
    /* global PROJECTS */
    ,
    proxyDeliveryApi: PROXY_DELIVERY_API
    /* global PROXY_DELIVERY_API */
    ,
    publicUri: PUBLIC_URI
    /* global PUBLIC_URI */
    ,
    reverseProxyPaths: REVERSE_PROXY_PATHS
    /* global REVERSE_PROXY_PATHS */
    ,
    version: VERSION
    /* global VERSION */

  };

  const changeRoute = () => {
    setRoute('/');
  };

  return React.createElement(React.Fragment, null, React.createElement("button", {
    onClick: e => changeRoute()
  }, "Change Route"), React.createElement(StyledTable, null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("td", {
    colSpan: 2
  }, React.createElement("h1", null, "Version Information")))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", {
    colSpan: 2
  }, "Package detail")), React.createElement("tr", null, React.createElement("td", {
    className: "left"
  }, "Name"), React.createElement("td", null, packagejson.name)), React.createElement("tr", null, React.createElement("td", {
    className: "left"
  }, "Version"), React.createElement("td", null, packagejson.version)), React.createElement("tr", null, React.createElement("th", {
    colSpan: 2
  }, "Version info (state)")), React.createElement("tr", null, React.createElement("td", null, "Git repo url: "), React.createElement("td", null, React.createElement("a", {
    href: packagejson.repository,
    target: "_blank",
    rel: "noopener noreferrer"
  }, packagejson.repository))), React.createElement("tr", null, React.createElement("td", null, "Pipeline: "), React.createElement("td", null, React.createElement("a", {
    href: `${packagejson.repository}/pipelines/${version.buildNumber ? version.buildNumber : ''}`,
    target: "_blank",
    rel: "noopener noreferrer"
  }, version.buildNumber))), React.createElement("tr", null, React.createElement("td", null, "Commit: "), React.createElement("td", null, React.createElement("a", {
    href: `${packagejson.repository}/commit/${version.commitRef ? version.commitRef : ''}`,
    target: "_blank",
    rel: "noopener noreferrer"
  }, version.commitRef))), React.createElement("tr", null, React.createElement("td", null, "Project"), React.createElement("td", {
    className: project == 'unknown' ? 'red' : ''
  }, project)), React.createElement("tr", null, React.createElement("td", null, "Contensis version status: "), React.createElement("td", {
    className: version.contensisVersionStatus == 'published' ? 'green' : 'red'
  }, version.contensisVersionStatus)), React.createElement("tr", null, React.createElement("th", {
    colSpan: 2
  }, "Build configuration")), React.createElement("tr", null, React.createElement("td", null, "Environment"), React.createElement("td", null, config.servers.alias)), React.createElement("tr", null, React.createElement("td", null, "Public uri"), React.createElement("td", null, config.publicUri)), React.createElement("tr", null, React.createElement("td", null, "Servers"), React.createElement("td", null, React.createElement("div", null, "web: ", config.servers.web), React.createElement("div", null, "cms: ", config.servers.cms), React.createElement("div", null, "iis: ", config.servers.iis), React.createElement("div", null, "internal vip: ", config.servers.internalVip))), React.createElement("tr", null, React.createElement("td", null, "Reverse proxy paths"), React.createElement("td", null, Object.entries(config.reverseProxyPaths).map(([, path], key) => React.createElement("span", {
    key: key
  }, "[ ", path, " ] ")))), React.createElement("tr", null, React.createElement("td", null, "Projects"), React.createElement("td", null, Object.entries(config.projects).map(([, project], key) => React.createElement("div", {
    key: key
  }, "[ ", project.id, ": ", project.publicUri, " ]")))), React.createElement("tr", null, React.createElement("td", null, "Disable SSR inline-redux"), React.createElement("td", null, config.disabeSsrRedux.toString())), React.createElement("tr", null, React.createElement("td", null, "Proxy Delivery API requests"), React.createElement("td", {
    className: config.proxyDeliveryApi ? 'green' : 'red'
  }, config.proxyDeliveryApi.toString())))));
};

VersionInfo.propTypes = {
  project: PropTypes.string,
  version: PropTypes.object,
  setRoute: PropTypes.func
};

const mapStateToProps = state => {
  return {
    project: selectCurrentProject(state),
    version: {
      buildNumber: selectBuildNumber(state),
      commitRef: selectCommitRef(state),
      contensisVersionStatus: selectVersionStatus(state)
    }
  };
};

const mapDispatchToProps = {
  setRoute: (path, state) => setRoute(path, state)
};
var VersionInfo$1 = hot(module)(connect(mapStateToProps, mapDispatchToProps)(VersionInfo));

export { VersionInfo$1 as VersionInfo, mapComposer, mapEntries, setCachingHeaders_1 as setCachingHeaders, stringifyStrings_1 as stringifyStrings, urls, useComposerMapper, useEntriesMapper, useEntryMapper, useMapper };
//# sourceMappingURL=util.js.map
