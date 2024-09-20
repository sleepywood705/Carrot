import './Chat.css'
import socket from "../server"
import { InputField } from "./Chat_InputField";
import { MessageContainer } from "./Chat_MessageContainer";
import { useState, useEffect } from "react"

export function Chat() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState([])

  console.log("message List", messageList)

  useEffect(() => {
    socket.on('message', (message) => {
      setMessageList((prevState) => prevState.concat(message));
    })
    askUserName();
  }, [])

  const askUserName = () => {
    const userName = prompt("당신의 이름을 입력하세요")
    console.log("received user name", userName);

    socket.emit("login", userName, (res) => {
      if (res?.ok) {
        setUser(res.data);
      }
    })
  }
 
  const sendMessage = (event) => {
    event.preventDefault()
    socket.emit("sendMessage", message, (res) => {
      console.log("sendMessage res", res);
    })
  }

  return (
    <div className="Chat">
      <MessageContainer messageList={messageList} user={user} />
      <InputField message={message} setMessage={setMessage} sendMessage={sendMessage} />
    </div>
  );
}