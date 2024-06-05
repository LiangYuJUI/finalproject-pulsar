
# Elasticsearch sink connector


1. **進入 pulsar 資料夾啟動 pulsar**
```bash
docker compose up -d
```

同時進入 elastic 資料夾內啟動容器



2. **進入 pulsar 內部**

```bash
docker exec -it broker /bin/bash
```

進入 ```conf``` 資料夾新增 ``` elasticsearch-sink.yml ``` 

內容為：

```bash
configs:
  elasticSearchUrl: "http://elasticsearch:9200"
  indexName: "my_index"
  username: "your_username"  
  password: "your_password"
```
因為容器裡面沒裝vi, nano, sudo，啥都裝不了，所以可以用以下指令直接寫入

a. 
```bash
touch elasticsearch-sink.yml
```
b. 
```bash
echo configs:
  elasticSearchUrl: "http://elasticsearch:9200"
  indexName: "my_index"
  username: "your_username"
  password: "your_password"' > elasticsearch-sink.yml
```

c. 用 cat 檢查有無寫入

3. **cd 至 pulsar 後 create 一個 connector 檔案夾**

```bash mkdir connector```

進入之後用此指令下載 ```sinker```

```bash
wget https://archive.apache.org/dist/pulsar/pulsar-2.8.0/connectors/pulsar-io-elastic-search-2.8.0.nar -O pulsar-io-elastic-search-2.8.0.nar
``` 


4. **在內部使用此指令啟動 ```sinker```**

```bash
bin/pulsar-admin sinks localrun \
    --archive connector/pulsar-io-elastic-search-2.8.0.nar \
    --tenant public \
    --namespace default \
    --name elasticsearch-test-sink \
    --sink-config-file conf/elasticsearch-sink.yml \
    --inputs elasticsearch_test
```

5. **啟動成功之後再新開一個 ```terminal```**

- 在裡面傳送訊息
```
bin/pulsar-client produce elasticsearch_test --messages "{\"a\":1}"
```

- 利用這兩行指令測試，有 ouput 就成功了

``` 重置
curl -s http://localhost:9200/my_index/_refresh
```

``` 搜尋
curl -s http://localhost:9200/my_index/_search
```

若沒有成功，大概會是 ```elasticsearch``` 沒有開好、 ```sinker``` 沒啟動成功的問題（以上是使用此 ```repo``` 之設定測試，除了 ```elasticsearch``` 在 ```local``` 端開的）