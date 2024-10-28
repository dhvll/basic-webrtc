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

  return (
    <div>
      Sender
      <button> Send data </button>
    </div>
  )
}
