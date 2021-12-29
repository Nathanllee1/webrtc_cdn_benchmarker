import express from "express";
import fs from "fs";
import { peer_store } from "./store";

import * as path from "path";
import { logger } from "../logger";

import cors from "cors";

const app = express();
const http_port = 3000;

app.use(cors())

import {start_websocket} from "./websocket";
import chalk from "chalk";

app.listen(http_port, () => {
    logger.info(`App listening on port ${chalk.yellow(http_port)}`);
    start_websocket(app_store);
})  

// a hypothetical endpoint

// the file struct for this 
let file_struct = {
    test_file: {
        "cdn_url": "http://localhost:8080/test_files/DSC01268.jpg",
        "peers": []
    },
    test_file2: {
        "cdn_url": "http://localhost:8080/test_files/output.jpg",
        "peers": []
    }
}

let app_store = new peer_store(file_struct);

app.use("/", express.static(path.join(__dirname, '../build')));

app.get('/peers', (req, res) => {
    res.send (JSON.stringify(app_store.generate_peerlist(["test_file", "test_file2"])));
})
