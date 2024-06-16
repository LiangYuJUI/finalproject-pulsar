#### FileBeat output Pulsar測試
於根目錄

啟動pulsar
```
cd pulsar
sudo mkdir -p ./data/zookeeper ./data/bookkeeper
sudo chown -R 10000 data
docker-compose up -d
```

```
如果pulsar-beat-output進不去
sudo chown -R $(whoami):$(whoami) ~/log-server-test/finalproject-pulsar/filebeat/pulsar-beat-output
```

啟動FileBeat
```
cd filebeat
docker-compose up -d
```

啟動consumer
```
cd npm_client
nvm use 18.X.X
npm install
node consumer.js
```

啟動測試logs
```
cd logging_test
nvm use 20.X.X
npm install
node index.js
瀏覽器打localhost就可以在comsumer看到訊息
```
