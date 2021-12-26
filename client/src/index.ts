import { register_peer } from "./sender.js";
import { load_rtc_image } from "./rtc.js";

const load_cdn_image = (image_loc, file_name) => {
    // "rtc_cdn_" is the prefix for document ids
    let cdn_image = document.getElementById("rtc_cdn_" + file_name);
    let cdn_speed_text = document.getElementById("speed_text");
    let start_time = new Date().getTime();

    cdn_image.onload = () => {
        cdn_speed_text.innerText = "4.0 mb loaded in " + (new Date().getTime() - start_time) + " ms";
    };

    cdn_image.setAttribute("src", image_loc);
};

const initialize_app = async () => {
    const fetched_params = await fetch(`${window.location.origin}/peers`);
    const peer_params = await fetched_params.json();

    console.log(peer_params);

    Object.keys(peer_params).forEach(filename => {

        // if no peer for file, load over cdn
        if (Object.keys(peer_params[filename].peers).length == 0) {
            document.getElementById("rtc_status").innerText = "Image loaded over CDN. Open a new tab to get it peer to peer";
            load_cdn_image(peer_params[filename].cdn_url, filename);

        // else load over web rtc
        } 
        else {
            document.getElementById("rtc_status").innerText = "Image loaded over P2P!";
            load_rtc_image(peer_params[filename].peers[0].peer_info, peer_params[filename].peers[0].uuid);
        }
    });

    register_peer(Object.keys(peer_params));
};

initialize_app();
