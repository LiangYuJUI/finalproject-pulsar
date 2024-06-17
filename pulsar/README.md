## 佈署流程
```
sudo mkdir -p ./data/zookeeper ./data/bookkeeper
sudo chown -R 10000 data
docker-compose up -d

docker-compose exec broker bash
進入容器執行以下指令
bin/pulsar-admin tenants create np01
bin/pulsar-admin tenants create np03
bin/pulsar-admin tenants create np04

建立租戶np01、np04
bin/pulsar-admin namespaces create np01/api-v2-charging-stop           
bin/pulsar-admin namespaces create np01/api-v2-charging-start
bin/pulsar-admin namespaces create np01/api-v2-charging-set-current

bin/pulsar-admin namespaces create np03/api-v2-charging-stop           
bin/pulsar-admin namespaces create np03/api-v2-charging-start
bin/pulsar-admin namespaces create np03/api-v2-charging-set-current

bin/pulsar-admin namespaces create np04/api-v2-charging-stop           
bin/pulsar-admin namespaces create np04/api-v2-charging-start
bin/pulsar-admin namespaces create np04/api-v2-charging-set-current
在np01、np04中建立相同的namespace

bin/pulsar-admin namespaces list np01
bin/pulsar-admin namespaces list np03
bin/pulsar-admin namespaces list np04
確認namespace都有建立

exit
出來回到wsl或linux
docker restart broker
```