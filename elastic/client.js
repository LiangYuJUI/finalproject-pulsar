
const axios = require('axios').default

policy_name = 'test'
// change update index stage time interval
axios.put('http://localhost:9200/_cluster/settings',
        {
            "persistent": {
                "indices.lifecycle.poll_interval": "1m"
            }
        }
    )
    .then( (response) => console.log(response.data))
    .catch( (error) => console.log(error))


//新增 timestamp 功能讓 index name 可以使用
axios.put('http://localhost:9200/_ingest/pipeline/add-current-time',
        {
            "description": "automatically add the current time to the documents",
            "processors": [
                {
                    "set": {
                        "field": "@timestamp",
                        "value": "{{{_ingest.timestamp}}}"
                    }
                }
            ]
        }
    )
    .then( (response) => console.log(response.data))
    .catch( (error) => console.log(error))

axios.put('http://localhost:9200/_ilm/policy/'+`${policy_name}`,
    {
        "policy": {
          "phases": {
            "hot": {
              "min_age": "0ms",
              "actions": {
                "rollover": {
                  "max_age": "1m",
                  "max_docs": 1000
                },
                "set_priority": {
                  "priority": 150
                }
              }
            },
            "warm": {
              "min_age": "0m",
              "actions": {
                "set_priority": {
                  "priority": 100
                }
              }
            },
            "cold": {
              "min_age": "3m",
              "actions": {
                "set_priority": {
                  "priority": 50
                }
              }
            },
            "delete": {
              "min_age": "10m",
              "actions": {
                "delete": {}
              }
            }
          }
        }
      }
    )
    .then( (response) => console.log(response.data))
    .catch( (error) => console.log(error))

//check
axios.get('http://localhost:9200/_ilm/policy/test'+`${policy_name}`)
    .then( (response) => console.log(response.data))
    .catch( (error) => console.log(error))


axios.put('http://localhost:9200/_index_template/log_alias_template',
        {
            "index_patterns": ["log-*"],
            "template": {
                "settings": {
                    "number_of_replicas": 0,
                    "number_of_shards": 1,
                    "index.lifecycle.name": `${policy_name}`,
                    "index.lifecycle.rollover_alias": "log-alias",
                    "default_pipeline": "add-current-time"
                },
                "mappings": {
                    "properties": {
                        "@timestamp": {
                            "type": "date"
                        },
                        "message": {
                        "type": "text"
                        }
                    }   
                }
            }
        }
    )
    .then( (response) => console.log(response.data))
    .catch( (error) => console.log(error))

// create first index  
// log-alias and index.lifecycle.rollover_alias is the same 
axios.put('http://localhost:9200/%3Clog-%7Bnow%2Fd%7D-000001%3E',
        {
            "aliases": {
                "log-alias": {
                    "is_write_index": true
                }
            }
        }
    )
    .then( (response) => console.log(response.data))
    .catch( (error) => console.log(error))


