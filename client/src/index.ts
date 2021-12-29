import { load_cdn } from "./cdn";
import { peerList } from "../../src/store";
import { load_rtc_objs } from "./rtc_requester";

import { register_files } from "./rtc_hoster";
import { setup_ws } from "./ws"

export interface fileStorage {
    [filename: string] : Blob
}

export class storage {
    store:fileStorage;

    constructor(peerList:peerList) {
        this.store = {}

        peerList.file_list.forEach((file) => {
            this.store[file] = null;
        })
    }

    add_file(filename:string, blob:Blob) {
        this.store[filename] = blob;
    }
}


const initialize_app = async () => {
    const fetched_params = await fetch(`${window.location.origin}/peers`);
    const peer_params:peerList = await fetched_params.json();

    console.log(peer_params);

    let files:storage = new storage(peer_params);
    let ws:WebSocket = await setup_ws();

    await load_cdn(peer_params.cdn, files);
    
    ////// TEMP if statement
    if (Object.keys(peer_params.cdn).length == 0)
        load_rtc_objs(peer_params.rtc, ws);

        
    // wait for above two to finish
    register_files(files, ws);
    
}

initialize_app();