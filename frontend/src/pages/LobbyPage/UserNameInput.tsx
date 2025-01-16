import { useState } from "react"

const UserNameInput: React.FC<{onSubmitName: (name: string) => void}> = ({onSubmitName}) => {

    const [name, setName] = useState('')
    return (
        <div>
            <h2>Input your name:</h2>

            <input value={name} onChange={(event) => setName(event.target.value)}  />
            <button onClick={() => onSubmitName(name)}>Submit</button>
        </div>
    )
}

export default UserNameInput;