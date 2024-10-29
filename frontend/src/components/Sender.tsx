import { useEffect, useState } from "react"

export const Sender = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080")
    setSocket(socket)
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "sender",
        })
      )
    }
  }, [])

  const startSendingVideo = async () => {
    if (!socket) {
      alert("Socket not found")
      return
    }
    const pc = new RTCPeerConnection()
    pc.onnegotiationneeded = async () => {
      console.log("on negotiation needed")

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      socket?.send(
        JSON.stringify({ type: "createOffer", sdp: pc.localDescription })
      )
    }
    pc.onicecandidate = (event) => {
      console.log(event)

      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            type: "iceCandidate",
            candidate: event.candidate,
          })
        )
      }
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "createAnswer") {
        pc.setRemoteDescription(data.sdp)
      } else if (data.type === "iceCandidate") {
        pc.addIceCandidate(data.candidate)
      }
    }

    // for sharing screen
    // const stream = await navigator.mediaDevices.getDisplayMedia({
    //   video: true,
    //   audio: false,
    // })
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })
    pc.addTrack(stream.getVideoTracks()[0])
  }

  return (
    <div>
      Sender
      <button onClick={startSendingVideo}> Send data </button>
    </div>
  )
}
