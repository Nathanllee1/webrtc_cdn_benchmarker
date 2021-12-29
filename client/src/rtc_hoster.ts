import { fileStorage, storage } from ".";
import { ws_message } from "../../src/ws_types";

export async function register_files(files: storage, ws: WebSocket) {

    const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }

    const peerConnection = new RTCPeerConnection(configuration);

    setup_ws(ws, peerConnection);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log(files.store);

    // register offer
    ws.send(JSON.stringify({
        type: "peer_register",
        body: {
            rtc_config: offer,
            files: Object.keys(files.store)
        }
    }))

    // listen for ICE canidates
    peerConnection.addEventListener('icecandidate', event => {
        console.log("Got ice canidate");
        if (event.candidate) {
            ws.send({type:'iceCanidate', body: event.candidate});
        }
    });

}

function setup_ws(ws: WebSocket, peerConnection: RTCPeerConnection) {
    ws.addEventListener("message", async function (event) {
        console.log(event.data);
        try {
            parse_ws(JSON.parse(event.data), peerConnection);
        } catch (e) {
            console.log(e);
        }
    })
}

async function parse_ws(message: ws_message, peerConnection: RTCPeerConnection) {
    if (message["answer"]) {
        const remoteDesc = new RTCSessionDescription(message["answer"]);
        await peerConnection.setRemoteDescription(remoteDesc);
    }
    else if (message["iceCanidate"]) {
        try {
            await peerConnection.addIceCandidate(message["canidate"]);
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }


}