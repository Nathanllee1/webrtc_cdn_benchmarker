// Websocket stuff (in same file since keeping the file_struct as a var)

import chalk from "chalk";
import { Server } from "ws";
import { logger } from "../logger";
import { peer_store } from "./store";
import { Websocket_User } from "./websocket_user";

const ws_port = 5000;


export const start_websocket = (store:peer_store) => {
    const ws = new Server({ port: ws_port }, () => {
        logger.info(`Websocket listening on ${chalk.yellow(ws_port)}`);
    });

    ws.on('connection', (ws_obj) => {
        logger.info("Incoming connection")
        new Websocket_User(ws_obj, store);
    })
}
