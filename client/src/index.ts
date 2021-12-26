import { load_cdn } from "./cdn";
import { peerList } from "../../src/store";
import { load_rtc } from "./rtc";

const initialize_app = async () => {
    const fetched_params = await fetch(`${window.location.origin}/peers`);
    const peer_params:peerList = await fetched_params.json();

    console.log(peer_params);

    load_cdn(peer_params.cdn);

    load_rtc(peer_params.rtc);

    // setup_hosting()
    
}

initialize_app();