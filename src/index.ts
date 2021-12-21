import express from "express";
import fs from "fs";

import { start_websocket } from "./websocket";

const app = express();
const http_port = 3000;

app.listen(http_port, () => {
    console.log("App listening on port", http_port);
    start_websocket();
})

// a hypothetical endpoint

// the file struct for this 
let file_struct = [
    {
        "file_name": "test_file",
        "cdn_url": "https://drive.google.com/uc?export=download&id=1Ah2BtYr8wDn3_qO-Wd6gLsBYqDeTgIKD",
        "peer_info": {} 
    }
]

app.get('/', (req, res) => {
    const index = fs.readFileSync("/home/nathanlee/Workspace/webrtc_cdn/src/index.html");

    let index_string = index.toString();

    index_string = index_string.replace('"PEER_PARAMS"', struct_to_string(file_struct));
    res.set('Content-Type', 'text/html');
    res.send(index_string);
})

const struct_to_string = (struct: object[]) => {

    let ret:string[] = [];

    struct.forEach(file => {
        ret.push(JSON.stringify(file));
    })

    return ("[" + ret.join(", ") + "]")
}
