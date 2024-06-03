建docker
```
docker-compose up -d
```
在docker進行操作

input data:

on es1

```
curl -X POST "localhost:9200/test_index/_doc/1" -H 'Content-Type: application/json' -d'
{
  "field1": "value1"
}'
```

on es2

```
curl -X POST "localhost:9200/test_index/_doc/2" -H 'Content-Type: application/json' -d'
{
  "field2": "value1"
}'
```

search data:

on es3

```
curl -X GET "localhost:9200/test_index/_doc/1"
```
```
curl -X GET "localhost:9200/test_index/_doc/2"
```

