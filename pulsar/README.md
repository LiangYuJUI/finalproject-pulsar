# 簡易實作pulsar geo-repliction概念


[實作開始前，需先下載pulsar](https://pulsar.apache.org/docs/3.2.x/getting-started-home/)





![image](https://github.com/chadtied/pulsar_simple_geo-replication/assets/96424234/c88d2a3b-4582-41d7-9ade-8fd0bf2673b8)





概念說明: 以上圖說明 當producer傳一份資料給Topic T1的時候，clusterA和clusterB會個複製一份資料，當其中一個cluster出問題導致資料遺失或受損時，就可以取另一cluster的複製檔。






### 實作內容:




## 1. docker建立cluster


透過docker建立cluster-a、cluster-b、cluster-c、，還有各cluster的bookie、zookeeper、broker；下圖有三個broker，分別屬於實作中的cluster-a、cluster-b、cluster-c


![image](https://github.com/chadtied/pulsar_simple_geo-replication/assets/96424234/010f888a-8cd6-4552-9690-3033ecf86e8f)

**在當前目錄下建置docker-compose.yaml，並執行** 執行程式後，另開分頁。

**linux:**

```sudo docker-compose up```

**windows:**

```docker-compose up```

**Mac/ios:**

```有錢人店店```

查看目前docker狀況

```sudo docker ps```


## 2. Cluster設置


### 建立cluster-a和cluster-b相互連線


先透過cluster-a向cluster-b建立連線


```bin/pulsar-admin --admin-url http://localhost:8080 clusters create cluster-b --broker-url pulsar://broker-edge1:6650 --url http://broker-edge1:8080```



反之透過cluster-b向cluster-a建立連線


```bin/pulsar-admin --admin-url http://localhost:8081 clusters create cluster-a --broker-url pulsar://broker-main:6650 --url http://broker-main:8080```


### 建立cluster-a和cluster-c相互連線


先透過cluster-a向cluster-c建立連線


```bin/pulsar-admin --admin-url http://localhost:8080 clusters create cluster-c --broker-url pulsar://broker-edge2:6650 --url http://broker-edge2:8080```



反之透過cluster-c向cluster-a建立連線


```bin/pulsar-admin --admin-url http://localhost:8082 clusters create cluster-a --broker-url pulsar://broker-main:6650 --url http://broker-main:8080```


### 建立cluster-b和cluster-c相互連線



先透過cluster-b向cluster-c建立連線


```bin/pulsar-admin --admin-url http://localhost:8081 clusters create cluster-c --broker-url pulsar://broker-edge2:6650 --url http://broker-edge2:8080```



反之透過cluster-c向cluster-b建立連線


```bin/pulsar-admin --admin-url http://localhost:8082 clusters create cluster-b --broker-url pulsar://broker-edge1:6650 --url http://broker-edge1:8080```







接下我們要來建立cluster內部資料，下圖為cluster的階層結構

![image](https://github.com/chadtied/pulsar_simple_geo-replication/assets/96424234/12c6a40b-0095-4e27-ada8-e3b7e8544f92)


在這三個cluster下建立共用namespace


```bin/pulsar-admin --admin-url http://localhost:8080 tenants create edge1 --allowed-clusters cluster-a,cluster-b,cluster-c```

```bin/pulsar-admin --admin-url http://localhost:8081 tenants create edge1 --allowed-clusters cluster-a,cluster-b,cluster-c```

```bin/pulsar-admin --admin-url http://localhost:8082 tenants create edge1 --allowed-clusters cluster-a,cluster-b,cluster-c```

```bin/pulsar-admin --admin-url http://localhost:8080 namespaces create edge1/replicated --clusters cluster-a,cluster-b,cluster-c```

```bin/pulsar-admin --admin-url http://localhost:8081 namespaces create edge1/replicated --clusters cluster-a,cluster-b,cluster-c```

```bin/pulsar-admin --admin-url http://localhost:8082 namespaces create edge1/replicated --clusters cluster-a,cluster-b,cluster-c```





最後一步，我們要在namespace內建立topic，也就是producer、consumer訂閱，並處理資料的地方


```bin/pulsar-admin --admin-url http://localhost:8080 topics create edge1/replicated/events```



## 3. 放置監聽器


我們透過放置監聽器，確定producer、consumer的資料蒐集狀況


新開分頁，建立cluster-a /edge1/replicated/events的監聽器


```bin/pulsar-client --url http://localhost:8080 --listener-name external consume --subscription-name "sub-a" persistent://edge1/replicated/events -n 0```


新開分頁，建立cluster-b /edge1/replicated/events的監聽器


```bin/pulsar-client --url http://localhost:8081 --listener-name external consume --subscription-name "sub-b" persistent://edge1/replicated/events -n 0```


新開分頁，建立cluster-c /edge1/replicated/events的監聽器


```bin/pulsar-client --url http://localhost:8082 --listener-name external consume --subscription-name "sub-b" persistent://edge1/replicated/events -n 0```


## 4. 觀測結果


向```cluster-a > event``` topic 傳入訊息


```bin/pulsar-client --url http://localhost:8080 --listener-name external produce persistent://edge1/replicated/events --messages "Winter is so cute" ```


會發現cluster-a、cluster-b、cluster-c的listener都收到了有意義的訊息


反之，向```cluster-b > event``` topic 傳入訊息

```bin/pulsar-client --url http://localhost:8081 --listener-name external produce persistent://edge1/replicated/events --messages "Winter is so cute" ```

也會得到相同結果


那如果使用```disable-replication```傳呢 ?

```bin/pulsar-client --url http://localhost:8081 --listener-name external produce --disable-replication persistent://edge1/replicated/events --messages "However IU is the cutest"```

會發覺只有傳入的cluster得到訊息而已，此處是cluster-b


## 5. 停用並卸除docker


**linux:**

```sudo docker stop $(sudo docker ps -aq)```

```sudo docker rm $(sudo docker ps -aq)```

```sudo docker volume prune -f```

```sudo docker network prune -f```

```sudo docker image prune -a -f```


**windows:**

```docker stop $(docker ps -aq)```

```docker rm $(docker ps -aq)```

```docker volume prune -f```

```docker network prune -f```

```docker image prune -a -f```


參考資料&圖源:

[https://pulsar.apache.org/](https://pulsar.apache.org/)

[https://github.com/gurghet/pulsar-geo-replication](https://github.com/gurghet/pulsar-geo-replication)
