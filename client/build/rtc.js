
export const load_rtc_image = async (peer_description, uuid) => {
    console.log(peer_description);

    const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.setRemoteDescription(new RTCSessionDescription(peer_description));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);


    const socket = new WebSocket('ws://localhost:5000'); // Connection opened

    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({
            type: "answer",
            body: {
                uuid: uuid,
                answer: answer
            }
        }));
    }); // Listen for messages

    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });
};