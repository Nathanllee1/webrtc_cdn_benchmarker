import express from "express";
import fs from "fs";
import { peer_store } from "./store";

const app = express();
const http_port = 3000;

import {start_websocket} from "./websocket";

app.listen(http_port, () => {
    console.log("App listening on port", http_port);
    start_websocket(app_store);
})

// a hypothetical endpoint

// the file struct for this 
let file_struct = {
    test_file: {
        "cdn_url": "https://drive.google.com/uc?export=download&id=1Ah2BtYr8wDn3_qO-Wd6gLsBYqDeTgIKD",
        "peers": []
    }
}

let app_store = new peer_store(file_struct);

app.get('/', (req, res) => {
    const index = fs.readFileSync("/home/nathanlee/Workspace/webrtc_cdn/client/index.html");

    let index_string = index.toString();

    index_string = index_string.replace('"PEER_PARAMS"', JSON.stringify(file_struct));
    res.set('Content-Type', 'text/html');
    res.send(index_string);
})
