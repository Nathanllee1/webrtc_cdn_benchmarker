import { v4 as uuidv4 } from 'uuid';
import { logger } from '../logger';
import { peer_store } from './store';
import { ws_message, rtc_offer, register_info, rtc_answer, rtc_ice } from './ws_types';

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

            } catch (e) {
                logger.error(e);
            }

        })

        ws_obj.on('close', () => {
            logger.info(`Closing ${this.uuid}`);

            store.remove_peer(this.uuid);
        })
    }

    parse_ws_message = (data:ws_message) => {
        switch (data.type) {

            case "offer":
                logger.info(`Relaying offer for ${this.uuid}`);

                let offer_obj:rtc_offer = data.body;
                logger.info(offer_obj);

                this.store.send_message_to_peer(offer_obj.uuid, offer_obj);

            case "peer_register":
                logger.info(`Registering peers for ${this.uuid}`);
    
                let peer_obj:register_info = data.body;
                this.store.add_peer(
                    peer_obj.files, 
                    {uuid:this.uuid, peer_info:peer_obj.rtc_config}, 
                    this
                );
    
                break;

            case "answer":
                let answer_obj:rtc_answer = data.body;
                logger.info(`Relaying answer to ${answer_obj.uuid}`);

                this.store.send_message_to_peer(answer_obj.uuid ,answer_obj);

                break;

            case "iceCanidate":
                let ice_obj:rtc_ice = data.body;

                logger.info(`Relaying ice canidate to ${ice_obj.uuid}`);

                this.store.send_message_to_peer(ice_obj.uuid, ice_obj);

                break;
    
            default:
                throw new Error(`Message type ${data.type} not supported`)
        }
    }

    send_json = (obj:object) => {
        this.ws_obj.send(JSON.stringify(obj));
    }

}
