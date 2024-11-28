import { Message, MessageType } from '../../../shared/model'
import './Chat.css'

const Chat: React.FC<{messages: Message[]}> = ({messages}) => {

  console.log('messages to chat: ', messages)
  const chatDisplay = messages.map((message) => {

    const outputMessage = [];
    if (message.type == MessageType.USER) {
      outputMessage.push(`${message.senderName}:`)
    }

    outputMessage.push(message.text);
    // console.log('message: ', message)
    // console.log('outputMessage: ', outputMessage)
    
    return (
      <div>
        {outputMessage.join(' ')}
      </div>
    )
  })
  return (
    <div className="chat">
      {chatDisplay}


    </div>
  )
}

export default Chat;