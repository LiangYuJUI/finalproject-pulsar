## 期末報告架構(未完成)
目前只有空空的Elastic Stack
Elastic Stack會當作期末報告的UI和資料庫
```mermaid
graph
    A[Apache Pulsar] -->|message| B[Logstash 後端server]
    B --> C[Elasticsearch y 資料庫NoSQL]
    C --> D[Kibana 視覺化UI]
```

### 佈署流程
請在wsl、linux、mac上執行(mac環境問題請自行處理)
```
docker-compose up -d
```
### 測試運行
用瀏覽確認localhost:9200有沒有正常運行(Elasticsearch)
![alt text](README_image/image.png)

用瀏覽確認localhost:5601有沒有正常運行(Kibana)
![alt text](README_image/image-1.png)
