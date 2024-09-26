import './Chat.css'

export function Payment() {
    return (
      <div id="Payment">
        <input type="text" className='cost'/>
        <div className="cont_btn">
          <button>1,000</button>
          <button>500</button>
          <button>100</button>
        </div>
      </div>
    )
  }