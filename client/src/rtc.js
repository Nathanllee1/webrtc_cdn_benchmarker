const WS_URL = "ws://localhost:5000"
let peerConnection;

export const load_rtc_image = async (peer_description, uuid) => {
    const socket = new WebSocket(WS_URL); // Connection opened
    

    socket.addEventListener('open', function (event) {

        let answer = setup_rtc(peer_description, socket, uuid);

        socket.send(JSON.stringify({
            type: "answer",
            body: {
                uuid: uuid,
                answer: answer
            }
        }));
    }); // Listen for messages

    socket.addEventListener('message', async function (event) {
        console.log('Message from server ', event.data);

        try {
            let parsed = JSON.parse(event.data)

            if (parsed.iceCandidate) {
                try {
                    await peerConnection.addIceCandidate(parsed.body.canidate);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }

        } catch {

        }
    });
}

const setup_rtc = async(peer_description, socket, uuid) => {

    const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
    peerConnection = new RTCPeerConnection(configuration);

    const dataChannel = peerConnection.createDataChannel("stream");

    dataChannel.addEventListener('open', event => {
        console.log("Opened")
    })

    peerConnection.setRemoteDescription(new RTCSessionDescription(peer_description));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    

    peerConnection.addEventListener('icecandidate', event => {
        console.log("Got ice canidate");
        if (event.candidate) {
            socket.send(JSON.stringify({ type: 'iceCanidate', body: { canidate: event.candidate, uuid: uuid }}));
        }
    });

    peerConnection.addEventListener('connectionstatechange', event => {
        if (peerConnection.connectionState === 'connected') {
            console.log("Hell yeah!")
            // Peers connected!
        }
    });

    peerConnection.onnegotiationneeded = async function () {
        console.log("Negoitiaon needed")

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.send(JSON.stringify({type:'offer', body: {offer: offer, uuid: uuid}}));

    }

    return (answer);
    
};
