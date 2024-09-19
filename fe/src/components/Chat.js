import './Chat.css'


export function Chat() {
  return (
    <div id="Chat">
      <div className="chattingbox">

      </div>
      <div className="cont_input">
        <input 
          id="messageInput"
          type="text" 
        />
        <input type="submit" value="전송" />
      </div>
    </div>
  );
};