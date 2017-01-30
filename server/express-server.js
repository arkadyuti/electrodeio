"use strict";

const Promise = require("bluebird");
const express = require("express");

// Falcor
const FalcorServer = require('falcor-express');
const bodyParser = require('body-parser');
const Router = require('falcor-router');

const app = express();
const path = require("path");
const _ = require("lodash");
const defaultConfig = require("electrode-confippet").config;
const Confippet = require("electrode-confippet");

// Falcor
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/model.json', FalcorServer.dataSourceRoute(() => new NamesRouter()));
// var NamesRouter = Router.createClass([
//   route: "names.length",

//   get: function(pathSet) {
//             return todosService.
//                 getTodoList().
//                 then(function(todoList) {
//                     return { path: ["todos", "name"], value: todoList.name };
//                 }) ;
//         }
// ]);


var data = {
        names: [
            { name: 'a' },
            { name: 'b' },
            { name: 'c' }
        ]
    }
    // var NamesRouter = Router.createClass([{
    //     route: 'names.length',
    //     get: function() {
    //         return{
    //             path: ['names', 'length'],
    //             value: data.names.length
    //         }
    //     }
    // }]);
var results = [];


app.use('/model.json', FalcorServer.dataSourceRoute(function(req, res) {
    // create a Virtual JSON resource with single key ("greeting")
    return new Router([{
        route: 'names[{integers:nameIndexes}]["name"]',
        get: (pathSet) => {
            return pathSet[1].map(function(key) {
                return { path: ["names", key], value: data.names[key] };
            });

        }
    }]);

}));

// pathSet.nameIndexes.forEach(nameIndex => {
//                if (data.names.length > nameIndex) {
//                    results.push({
//                        path: ['names', nameIndex, 'name'],
//                        value: data.names[nameIndex].name
//                    })
//                    console.log(results);
//                }
//            })
//            return results
// app.use('/model.json', FalcorServer.dataSourceRoute(function(req, res) {
//     // create a Virtual JSON resource with single key ("greeting")
//     return new Router([{
//         // match a request for the key "greeting"    
//         route: "greeting",
//         // respond with a PathValue with the value of "Hello World."
//         get: function() {
//             return { path:["greeting"], value: "Hello World" };
//         }
//     }]);
// }));


const loadConfigs = function(userConfig) {
    //use confippet to merge user config and default config
    if (_.get(userConfig, "plugins.electrodeStaticPaths.enable")) {
        userConfig.plugins.electrodeStaticPaths.enable = false;
    }

    return Confippet.util.merge(defaultConfig, userConfig);
};

const setStaticPaths = function() {
    app.use(express.static(path.join(__dirname,
        defaultConfig.$("plugins.electrodeStaticPaths.options.pathPrefix"))));
};

const setRouteHandler = () => new Promise((resolve, reject) => {
    const webapp = (p) => p.startsWith(".") ? path.resolve(p) : p;
    const registerRoutes = require(webapp(defaultConfig.$("plugins.webapp.module"))); //eslint-disable-line

    return registerRoutes(app, defaultConfig.$("plugins.webapp.options"),
        (err) => {
            if (err) {
                console.error(err); //eslint-disable-line
                reject(err);
            } else {
                resolve();
            }
        }
    );
});

const startServer = () => new Promise((resolve, reject) => {
    app.listen(defaultConfig.$("connections.default.port"), (err) => {
        if (err) {
            reject(err);
        } else {
            //eslint-disable-next-line
            console.log(`App listening on port: ${defaultConfig.$("connections.default.port")}`);
            resolve();
        }
    });
});

module.exports = function electrodeServer(userConfig, callback) {
    const promise = Promise.resolve(userConfig)
        .then(loadConfigs)
        .then(setStaticPaths)
        .then(setRouteHandler)
        .then(startServer);

    return callback ? promise.nodeify(callback) : promise;
};
