

export const register_peer = async (files) => {
    const configuration = {
        'iceServers': [{
            'urls': 'stun:stun.l.google.com:19302'
        }]
    };
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnection.addEventListener('datachannel', event => {
        const dataChannel = event.channel;

    });

    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    const socket = new WebSocket(`ws://${window.location.hostname}:5000`); // Connection opened

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

                console.log("Recieved and added answer");
            }
            else if (parsed.canidate) {
                try {
                    await peerConnection.addIceCandidate(parsed.canidate.canidate);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }

        } catch {

        }
    });

    peerConnection.addEventListener('icecandidate', event => {
        console.log("Got ice canidate");
        if (event.candidate) {
            socket.send({type:'iceCanidate', body: event.candidate});
        }
    });

    peerConnection.addEventListener('connectionstatechange', event => {
        if (peerConnection.connectionState === 'connected') {
            console.log("Hell yeah!")
            // Peers connected!
        }
    });

    peerConnection.onnegotiationneeded = function () {
        console.log("Negoitiaon needed")

        
    }
};
