## Data 三溫暖功能使用方式

### 以下的指令都在左上角三條線->Dev Tool 的介面來輸入

1. 創建名稱為 hot-warm-cold 的 ilm policy

```js
PUT _ilm/policy/hot-warm-cold
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
```

2. 新增 timestamp 功能讓 index name 可以使用

```js
PUT _ingest/pipeline/add-current-time
{
  "description" : "automatically add the current time to the documents",
  "processors" : [
    {
      "set" : {
        "field": "@timestamp",
        "value": "{{{_ingest.timestamp}}}"
      }
    }
  ]
}
```

3. 新增 index 的 template

```js
PUT _index_template/log_template
{
  "index_patterns": ["log-*"],
  "template": {
    "settings": {
      "number_of_replicas": 0,
      "number_of_shards": 1,
      "index.lifecycle.name": "hot-warm-cold",
      "index.lifecycle.rollover_alias": "log",
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
```

4. 創建最一開始的節點(但我之前測試時發現它的時間對照有點怪怪的，感覺是以創建第一個點開始的瞬間起算，所以可能在 0:00 創建 timestamp 就可以正確)

```js
PUT /%3Clog-%7Bnow%2Fd%7D-000001%3E
{
  "aliases": {
    "log": {
      "is_write_index": true
    }
  }
}
```

5. 原本 kibana 預設是每 10 分鐘會重新更新一次，因為現在時間間隔設比較短，所以改成每 1 分鐘就更新一次

```js
PUT _cluster/settings
{
  "persistent": {
    "indices.lifecycle.poll_interval": "1m"
  }
}
```

### 實作參考網站

1. [架構設計](https://github.com/jakelandis/docker-hot-warm-cold/blob/master/)
2. [ilm policy 設計](https://jettro.dev/managing-you-elasticsearch-indexes-3d2252c7a33e)
