import { v4 as uuidv4 } from 'uuid';
import { peer_store } from './store';

interface ws_message {
    type: string,
    body: any
}

interface register_info {
    rtc_config: object,
    files: string[]
}

interface rtc_answer {
    uuid: string,
    answer: object
}

export class Websocket_User {

    ws_obj:WebSocket;
    uuid:string;
    store:peer_store;

    constructor(ws_obj:any, store:peer_store) {
        this.ws_obj = ws_obj;
        this.uuid = uuidv4();
        this.store = store;

        ws_obj.on('message', (data:any) => {
            try {
                let parsed:ws_message = JSON.parse(data.toString())
                this.parse_ws_message(parsed);

            } catch {
                console.error("Couldn't parse json", data.toString());
            }

        })

        ws_obj.on('close', () => {
            console.log("Closing", this.uuid);

            store.remove_peer(this.uuid);
        })
    }

    parse_ws_message = (data:ws_message) => {
        switch (data.type) {
            case "peer_register":
                console.log("Registering peers");
    
                let peer_obj:register_info = data.body;
    
                this.store.add_peer(
                    peer_obj.files, 
                    {uuid:this.uuid, peer_info:peer_obj.rtc_config}, 
                    this
                );
    
                break;

            case "answer":

                console.log("Relaying answer");

                let answer_obj:rtc_answer = data.body;

                this.store.send_message_to_peer(answer_obj.uuid ,answer_obj);

                break;
    
            default:
                throw new Error(`Message type ${data.type} not supported`)
        }
    }

    send_json = (obj:object) => {
        this.ws_obj.send(JSON.stringify(obj));
    }

}
