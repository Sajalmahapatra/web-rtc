import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // signaling server

const VideoCall = () => {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const pc = useRef(null);
  const [isCaller, setIsCaller] = useState(false);

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideo.current.srcObject = stream;

      pc.current = new RTCPeerConnection();

      stream.getTracks().forEach(track => pc.current.addTrack(track, stream));

      pc.current.ontrack = event => {
        remoteVideo.current.srcObject = event.streams[0];
      };

      pc.current.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate);
        }
      };
    };

    init();

    socket.on('offer', async offer => {
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      socket.emit('answer', answer);
    });

    socket.on('answer', async answer => {
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async candidate => {
      try {
        await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error('Error adding received ice candidate', e);
      }
    });
  }, []);

  const startCall = async () => {
    setIsCaller(true);
    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    socket.emit('offer', offer);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <video ref={localVideo} autoPlay playsInline muted className="w-64 border" />
      <video ref={remoteVideo} autoPlay playsInline className="w-64 border" />
      {!isCaller && (
        <button onClick={startCall} className="px-4 py-2 bg-blue-500 text-white rounded">
          Start Call
        </button>
      )}
    </div>
  );
};

export default VideoCall;
