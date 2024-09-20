import './Chat.css'
import socket from "../server"
import { InputField } from "./Chat_InputField";
import { MessageContainer } from "./Chat_MessageContainer";
import { useState, useEffect, useRef } from "react"

export function Chat() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState([])
  const userNameAsked = useRef(false);

  useEffect(() => {
    if (!userNameAsked.current) {
      const userName = prompt("당신의 이름을 입력하세요");
      userNameAsked.current = true;
      
      if (userName) {
        socket.emit("login", userName, (res) => {
          if (res?.ok) {
            setUser(res.data);
          }
        });
      }
    }

    const messageHandler = (message) => {
      setMessageList((prevState) => [...prevState, message]);
    };

    socket.on('message', messageHandler);

    return () => {
      socket.off('message', messageHandler);
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault()
    if (message.trim() && user) {
      socket.emit("sendMessage", message, (res) => {
        console.log("sendMessage res", res);
        setMessage('');
      })
    }
  }

  if (!user) {
    return <div>사용자 이름을 입력해주세요...</div>;
  }

  return (
    <div className="Chat">
      <MessageContainer messageList={messageList} user={user} />
      <InputField message={message} setMessage={setMessage} sendMessage={sendMessage} />
    </div>
  );
}