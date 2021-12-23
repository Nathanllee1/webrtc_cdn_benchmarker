// Websocket stuff (in same file since keeping the file_struct as a var)

import { Server } from "ws";
import { peer_store } from "./store";
import { Websocket_User } from "./websocket_user";

const ws_port = 5000;


export const start_websocket = (store:peer_store) => {
    const ws = new Server({ port: ws_port }, () => {
        console.log("Websocket listening on", ws_port);
    });

    ws.on('connection', (ws_obj) => {
        new Websocket_User(ws_obj, store);
    })
}


// SCHEMAS
/*
REGISTER_PEER
{
    type: peer_register
    body :
        {
            rtc_config: {},
            files: []
        }
    
}


SHARE_PEER


*/