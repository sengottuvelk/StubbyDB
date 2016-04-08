var assert = require('./lib.js').assert;

function getConfig(options){
	var mod = '../os/nushi/stubbydb/configbuilder';
	delete require.cache[require.resolve(mod)];
	var configBuilder = require(mod);
	configBuilder.buildConfig(options,options.length+2);
	return configBuilder.getConfig();
}

//---------------- Default

var expectedConfig = {
	mappings: {
		default: {
			request:{
				method: 'GET'
			},
			response: {
				strategy: 'first-found',
				latency: 0,
				status: 200
			}
		},
		requests: ["response.yaml"]
	},
	server: {
		port: 9999,
		host: 'localhost'
	},
	stubs: 'stubs/',
	dbsets: 'dbsets'
};
actualConfig = getConfig([]);

assert(actualConfig,expectedConfig);

//---------------- -p,-m,-s

var options = {
	'-C' : '{"mappings":{"default":{"request":{"method":"XYZ"},"response":{"strategy":"first-found","status":202}},"requests":["mapping.yaml"]}}'
	,'-p' : 7789
	,'-m' : 'some.yaml'
	,'-s' : 'stub/'
}

var expectedConfig = {
	mappings: {
		default: {
			request:{
				method: 'XYZ'
			},
			response: {
				strategy: 'first-found',
				latency: 0,
				status: 202
			}
		},
		requests: ["some.yaml"]
	},
	server: {
		port: 7789		,
		host: 'localhost'
	},
	stubs: 'stub/'
};

actualConfig = getConfig(options);

assert(actualConfig,expectedConfig);

//---------------- -c

var options = {
	'-c' : __dirname + '/config.json'
	,'-p' : 7789
	,'-m' : 'some.yaml'
	,'-s' : 'stub/'
}

var expectedConfig = {
	mappings: {
		default: {
			request:{
				method: 'GET'
			},
			response: {
				strategy: 'first-found',
				latency: 0,
				status: 200
			}
		},
		requests: ["some.yaml"]
	},
	server: {
		port: 7789,
		host: 'localhost'
	},
	stubs: 'stub/',
	dbsets: "dbsets"
};

actualConfig = getConfig(options);

assert(actualConfig,expectedConfig);

//---------------- -d : project location and different host

var options = {
	'-d' : __dirname + '/testdir'
	,'-p' : 7790
	,'--host' : 'abcd.com'
}

var expectedConfig = {
	dbsets: __dirname + "/testdir/dbsets/",
	stubs: __dirname + "/testdir/stubs/",
	mappings: {
		default: {
			request:{
				method: 'GET'
			},
			response: {
				strategy: 'first-found',
				latency: 0,
				status: 200
			}
		},
		requests: [__dirname + "/testdir/mappings/some.yaml"]
	},
	server: {
		port: 7790,
		host: 'abcd.com'
	}
	//,dumps: __dirname + "/testdir/dumps/"
};

actualConfig = getConfig(options);

assert(actualConfig,expectedConfig);

//---------------- -d -c

var options = {
	'-d' : __dirname + '/testdir'
	,'-c' : 'config.json'
}

var expectedConfig = {
	mappings: {
		default: {
			request:{
				method: 'GET'
			},
			response: {
				strategy: 'first-found',
				latency: 0,
				status: 200
			}
		},
		requests: [__dirname + '/testdir/' + "response.yaml"]
	},
	server: {
		port: 9999,
		host: 'localhost'
	},
	stubs: __dirname + '/testdir/' + 'stub',
	dbsets: __dirname + '/testdir/' + "dbsets",
	dumps: __dirname + '/testdir/' + "dumps"
};

actualConfig = getConfig(options);
assert(actualConfig,expectedConfig);

//---------------- -d -c -m -p -s

var options = {
	'-d' : __dirname + '/testdir'
	,'-c' : 'config.json'
	,'-p' : 7789
	,'-m' : 'some.yaml'
	,'-s' : 'stub/'
}

var expectedConfig = {
	mappings: {
		default: {
			request:{
				method: 'GET'
			},
			response: {
				strategy: 'first-found',
				latency: 0,
				status: 200
			}
		},
		requests: [ "some.yaml"]
	},
	server: {
		port: 7789,
		host: 'localhost'
	},
	stubs: 'stub/',
	dbsets: __dirname + '/testdir/' + "dbsets",
	dumps: __dirname + '/testdir/' + "dumps"
};

actualConfig = getConfig(options);
assert(actualConfig,expectedConfig);