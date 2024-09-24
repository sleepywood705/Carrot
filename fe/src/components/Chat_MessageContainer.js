import './Chat.css'


export function MessageContainer({ messageList, user }) {
  return (
    <div id="MessageContainer">
      {messageList.map((message, index) => {
        return (
          <div key={message._id}>
            {message.user.name === "system" ? (
              <p className="message system">{message.chat}</p>
            ) : message.user.name === user.name ? (
              <p className="message my">{message.chat}</p>
            ) : (
              <div className="z">
                <p className="name user">{message.user.name}</p>
                <p className="message other">{message.chat}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};