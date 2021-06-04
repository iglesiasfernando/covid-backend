var config = {
    dev: {
        port: "8069",
        database: {
            connectionstring: "mongodb://test:test@cluster0-shard-00-00.hpqmh.mongodb.net:27017,cluster0-shard-00-01.hpqmh.mongodb.net:27017,cluster0-shard-00-02.hpqmh.mongodb.net:27017/meliStudy?ssl=true&replicaSet=atlas-uk2je3-shard-0&authSource=admin&retryWrites=true&w=majority"
        },
        
    },
    test: {
        port: "8069",
        database: {
            connectionstring: "mongodb://test:test@cluster0-shard-00-00.hpqmh.mongodb.net:27017,cluster0-shard-00-01.hpqmh.mongodb.net:27017,cluster0-shard-00-02.hpqmh.mongodb.net:27017/meliStudy?ssl=true&replicaSet=atlas-uk2je3-shard-0&authSource=admin&retryWrites=true&w=majority"
        },
    },
    production: {
        port: "8069",
        database: {
            connectionstring: "mongodb://test:test@cluster0-shard-00-00.hpqmh.mongodb.net:27017,cluster0-shard-00-01.hpqmh.mongodb.net:27017,cluster0-shard-00-02.hpqmh.mongodb.net:27017/meliStudy?ssl=true&replicaSet=atlas-uk2je3-shard-0&authSource=admin&retryWrites=true&w=majority"
        },
    },
}

exports.get = function get(env) {
    return config[env] || config.dev;
}