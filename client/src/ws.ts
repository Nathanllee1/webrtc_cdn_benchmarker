export const setup_ws = () => {
    let ws = new WebSocket(`ws://${window.location.hostname}:5000`);

    return new Promise<WebSocket>((resolve, reject) => {
        ws.addEventListener('open', function (event) {
            resolve(ws);
        })
    })
}

export class ws_interface {

    ws:WebSocket;
    uuid:string;

    constructor(ws:WebSocket, uuid:string) {
        this.ws = ws;
        this.uuid = uuid;
    }

    send_json(mes:object) {
        this.ws.send(JSON.stringify(mes));
    }

    send_answer(answer:object) {
    }

}