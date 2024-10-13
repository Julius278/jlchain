# jlchain
small blockchain project


## prerequisites
install all required node modules<br>
```npm install```


## run the chain
### Run the Bootnode / peer
bootnode / peer starts by default on HTTP_PORT 3001 and P2P_PORT 5001:<br>
```npm run dev```<br>

### run additional peers
second peer which uses the predefined 5001 bootnode port to connect:<br>
```HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev```

third peer connects to both nodes:<br>
```HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev```

## ports explanation
HTTP_PORT: used to communicate with the node from a users or miners perspective.<br>
P2P_PORT: peer-to-peer port used by other nodes to exchange block / transaction information between nodes via websocket connection.<br>