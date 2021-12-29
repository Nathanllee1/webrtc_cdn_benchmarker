import { ws } from "http2-proxy";
import { rtc_description, rtc_list } from "../../src/store";

// create a separate connection every 
export function load_rtc_objs(cdn_desc: rtc_list, ws:WebSocket) {
    Object.keys(cdn_desc).forEach(peer => {
        load_rtc(cdn_desc[peer], ws, peer);
    })
}


async function load_rtc(desc: rtc_description, ws:WebSocket, uuid:string) {
    const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }

    const peerConnection = new RTCPeerConnection(configuration);
    peerConnection.setRemoteDescription(new RTCSessionDescription(desc.peer_description));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    ws.send(JSON.stringify({
        type: "answer",
        body: {
            answer: answer,
            uuid: uuid
        }
    }))

    peerConnection.onnegotiationneeded = async function () {
        console.log("Negoitiaon needed")

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        ws.send(JSON.stringify({type:'offer', body: {offer: offer, uuid: uuid}}));

    }
}