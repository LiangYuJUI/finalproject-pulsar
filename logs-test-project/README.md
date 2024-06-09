## 測試啟動
node js建議用 V18.X.X(nvm管理)
加上.env檔 (notion上 Teamspaces RD有寫)
如果非正式佈署記得把.env的port改掉
```
npm install
npm run dev
```

## 正式佈署
```
node run build
docker compose up -d
```