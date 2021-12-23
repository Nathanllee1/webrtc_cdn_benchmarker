import { peer_store } from "../src/store"
import { deep_copy } from "./test_utils";

import { v4 as uuidv4 } from 'uuid';


const sample_config = {
    test_file: {
        "cdn_url": "url.com",
        "peers": []
    },
    test_file2: {
        "cdn_url": "foo.org",
        "peers": []
    }
}

let sample_rtc_config = {
    peer_info: {},
    uuid: uuidv4()
}


describe("Test Store", () => {
    
    test("Test Add 1 File", () => {
        let store = new peer_store(deep_copy(sample_config));

        store.add_peer(["test_file"], sample_rtc_config);

        expect(store.base_store.test_file.peers.length).toBe(1);
    }),
    

    test("Test Add 2 Files", () => {
        let store = new peer_store(deep_copy(sample_config));

        store.add_peer(["test_file", "test_file2"], sample_rtc_config);
        expect(store.base_store.test_file.peers.length).toBe(1);
        expect(store.base_store.test_file2.peers.length).toBe(1);
    })

    test("Add unknown file", () => {
        let store = new peer_store(deep_copy(sample_config));

        store.add_peer(["NOT_A_FILE"], sample_rtc_config);
        expect(store.base_store.test_file.peers.length).toBe(0);
        expect(store.base_store.test_file2.peers.length).toBe(0);
    })
})
