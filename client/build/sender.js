
export const setup_rtc_offer = async () => {
    const configuration = {
        'iceServers': [{
            'urls': 'stun:stun.l.google.com:19302'
        }]
    };
    const peerConnection = new RTCPeerConnection(configuration);
    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    return (offer);
};

export const register_peer = async (files) => {
    let offer = await setup_rtc_offer(); // Create WebSocket connection.

    const socket = new WebSocket('ws://localhost:5000'); // Connection opened

    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({
            type: "peer_register",
            body: {
                rtc_config: offer,
                files: files
            }
        }));
    }); // Listen for messages

    socket.addEventListener('message', async function (event) {
        console.log('Message from server ', event.data);

        try {
            let parsed = JSON.parse(event.data)

            if (parsed.answer) {
                const remoteDesc = new RTCSessionDescription(parsed.answer);
                await peerConnection.setRemoteDescription(remoteDesc);
            }

        } catch {

        }

        
        
    });
};
