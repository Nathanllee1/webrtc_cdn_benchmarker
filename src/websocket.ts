import { Server } from "ws";

const ws_port = 5000;

export const start_websocket = () => {
    const ws = new Server({ port: ws_port }, () => {
        console.log("Websocket listening on", ws_port);
    });

    ws.on('connection', (ws_obj) => {
        ws_obj.send("Heyo!");
        ws_obj.on('message', (data) => {
            // console.log(data);
        })
    })
}
