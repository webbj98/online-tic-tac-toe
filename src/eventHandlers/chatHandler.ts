import { Events } from "../../shared/events";
import { Message, MessageType } from "../../shared/model";
import { socket } from "../socket";


// export function addMessageToChat(message: string) {

// }

export function sendMessage(inputMessage: string, lobbyKey: string, senderName: string) {
    const message: Message = {
        type: MessageType.USER,
        text: inputMessage,
        senderName: senderName,
        lobbyKey: lobbyKey,
    }

    socket.emit(Events.MessageSend, message)
}