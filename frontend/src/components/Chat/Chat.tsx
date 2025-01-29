import { useState } from 'react'
import { Message, MessageType } from '../../../../shared/src/model'
import './Chat.css'

const Chat: React.FC<{messages: Message[], onSend: (msg: string) => void}> = ({messages, onSend}) => {

  const [currentMsg, setCurrentMsg] = useState('')
  const chatDisplay = messages.map((message) => {

    const outputMessage = [];
    let userNamePrefix;
    if (message.type == MessageType.USER) {
      // outputMessage.push(`${message.senderName}:`)
      userNamePrefix = <span className='username'>{message.senderName}: </span>
    }

    outputMessage.push(message.text);
    return (
      <div className='chat-message'>
        
        {userNamePrefix}{message.text}
      </div>
    )
  })

  const handleSendMsg = () => {
    onSend(currentMsg);
    setCurrentMsg('')


  }

  return (
    <div className="chat">
      <div className='chat-messages'>
        {chatDisplay}
      </div>

      <div className='chat-action-row'>
        <input className='chat-input' value={currentMsg} onChange={(event) => setCurrentMsg(event.target.value)}  />
        <button className='chat-send-button' onClick={() => handleSendMsg()}>Send</button>

      </div>
      

      


    </div>

    
  )
}

export default Chat;