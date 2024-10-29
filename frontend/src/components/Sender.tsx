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
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    socket?.send(
      JSON.stringify({ type: "createOffer", sdp: pc.localDescription })
    )

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "createOffer") {
        await pc.setRemoteDescription(data.sdp)
      }
    }
  }

  return (
    <div>
      Sender
      <button onClick={startSendingVideo}> Send data </button>
    </div>
  )
}
