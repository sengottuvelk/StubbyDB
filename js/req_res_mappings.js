var YAML = require('yamljs');
var preutil = require('./preutil');

var config_mapping = preutil.getConfigFor('mappings');

if(!config_mapping){
    config_mapping = {
        //default: "./mappings/default.yaml" ,
        requests: ["./response.yaml"]
    }
}

var allMappings = [];

var defaultConfig;
if(config_mapping.default){
    defaultConfig = YAML.parseFile(config_mapping.default);
}else{
    defaultConfig = [{
        response: {
            status: 200,
            latency: 0
        }
    }]
}


for(var i in config_mapping.requests){
    console.log("Loading mappings from " + config_mapping.requests[i]);
    var mappings = YAML.parseFile(config_mapping.requests[i]);
    if(!mappings || mappings.length == 0){
        console.log(config_mapping.requests[i] + " is an empty file.");
        break;
    }
    for(var i=0;i<mappings.length;i++){
        var entry = mappings[i];

        if(typeof entry.response == 'string'){
            entry.response = {
                body: entry.response,
                status: 200,
                latency: 0
            }
        }

        if(typeof entry.request == 'string'){
            entry.request = {
                url: entry.request,
                method: 'GET'
            }
        }


        if(!entry.response.status){
            if(defaultConfig[0].response.status){
                entry.response['status'] = defaultConfig[0].response.status;
            }else{
                entry.response['status'] = 200;
            }
        }

        if(!entry.response.latency){
            if(defaultConfig[0].response.latency){
                entry.response['latency'] = defaultConfig[0].response.latency;
            }else{
                entry.response['latency'] = 0;
            }
        }

        if(!entry.response.strategy){
            if(defaultConfig[0].response.strategy){
                entry.response['strategy'] = defaultConfig[0].response.strategy;
            }else if(entry.response.files){
                entry.response['strategy'] = 'not-found';
            }
        }

        if(!entry.request.method){
            entry.request['method'] = 'GET';
        }

    }
    allMappings = allMappings.concat(mappings);
}
exports.mappings = allMappings;