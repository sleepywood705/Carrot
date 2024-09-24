import './Chat.css'


export function InputField({ message, setMessage, sendMessage }) {
  return (
    <div className="input-area">
      <form onSubmit={sendMessage} className="cont_input">
        <input
          type="text"
          placeholder="하고 싶은 말을 입력하세요"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          multiline={false}
          rows={1}
        />
        <button
          disabled={message === ""}
          type="submit"
          className="send-button"
        >
          전송
        </button>
      </form>
    </div>
  )
}