import { Websocket_User } from "./websocket_user";

interface app_store {
    [index: string]: {
        cdn_url: string,
        peers: peer_description[]
    }
}

interface peer_description {
    uuid: string,
    peer_info: object,
}

interface peer {
    [index: string]: Websocket_User;
}

export interface peerList {
    cdn: cdn_description[],
    rtc: rtc_list
}

export interface cdn_description {
    filename: string,
    cdn_url: string
}

export interface rtc_list {
    [uuid: string]:rtc_description
}

export interface rtc_description  {
    peer_description: object,
    cdn_fallback: cdn_description[]
}

export class peer_store {

    base_store: app_store;
    peerList: peer = {};

    constructor(base_store: app_store) {
        this.base_store = base_store;
    }

    generate_peerlist(files: string[]) {

        let peerlist: peerList = {
            cdn: [],
            rtc: {}
        };

        files.forEach((file) => {
            let file_obj = this.base_store[file];

            if (file_obj) {
                // no peers, use cdn
                if (file_obj.peers.length == 0) {
                    peerlist.cdn.push({
                        filename: file,
                        cdn_url: file_obj.cdn_url
                    })
                }
                else {
                    let peer = this.pick_peer(file_obj.peers);
                    peerlist.rtc[peer.uuid].peer_description = peer.peer_info;
                    peerlist.rtc[peer.uuid].cdn_fallback.push({
                        filename: file,
                        cdn_url: file_obj.cdn_url
                    })
                }
            } else {
                console.error(`${file} not found`)
            }
        });

        return (peerlist);
    }

    // TODO: create a better peer resolution strategy, currently picks top of the list
    pick_peer(peers: peer_description[]) {
        return (peers[0]);
    }

    add_peer(files: string[], peer: peer_description, ws: Websocket_User) {
        this.peerList[peer.uuid] = ws;

        files.forEach((file) => {

            if (this.base_store[file]) {
                this.base_store[file].peers.push(peer);
            } else {
                console.error(`File ${file} does not exist`);
            }

        })
    }

    remove_peer(uuid: string) {
        Object.keys(this.base_store).forEach((file) => {
            this.base_store[file].peers.forEach((peer, index) => {
                if (peer.uuid === uuid) {
                    this.base_store[file].peers.splice(index, 1);
                }
            })
        })
    }

    send_message_to_peer(uuid: string, message: object) {

        if (!uuid) {
            console.error("Specify a uuid")
        }

        this.peerList[uuid].send_json(message);
    }

}
