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
                {/* <img
                  src="/img/person.png"
                  style={
                    (index === 0
                      ? { visibility: "visible" }
                      : messageList[index - 1].user.name === user.name) ||
                      messageList[index - 1].user.name === "system"
                      ? { visibility: "visible" }
                      : { visibility: "hidden" }
                  }
                /> */}
                <span>
                  <p className="name user">{user.name}</p>
                  <p className="message other">{message.chat}</p>
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};