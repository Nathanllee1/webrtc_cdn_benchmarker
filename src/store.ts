import { Websocket_User } from "./websocket_user";

interface app_store {
    [index: string]: {
        cdn_url: string,
        peers: peer_description[]
    }
}

interface peer_description {
    uuid:string,
    peer_info: object,
}

interface peer {
    [index: string]: Websocket_User;
}

export class peer_store {

    base_store: app_store;
    peerList: peer = {};

    constructor(base_store: app_store) {
        this.base_store = base_store;
    }

    add_peer(files: string[], peer:peer_description, ws:Websocket_User) {
        this.peerList[peer.uuid] = ws;

        files.forEach((file) => {

            if (this.base_store[file]) {
                this.base_store[file].peers.push(peer);
            } else {
                console.error(`File ${file} does not exist`);
            }
            
        })
    }

    remove_peer(uuid:string) {
        Object.keys(this.base_store).forEach((file) => {
            this.base_store[file].peers.forEach((peer, index) => {
                if (peer.uuid === uuid) {
                    this.base_store[file].peers.splice(index, 1);
                }
            })
        })
    }

    send_message_to_peer(uuid:string, message:object) {
        this.peerList[uuid].send_json(message);
    }

}
