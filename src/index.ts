import express from "express";
import fs from "fs";
import { peer_store } from "./store";

import * as path from "path";

import cors from "cors";

const app = express();
const http_port = 3000;

app.use(cors())


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

app.use("/", express.static(path.join(__dirname, '../client/src')));

app.get('/peers', (req, res) => {
    res.send (JSON.stringify(app_store.base_store));
})