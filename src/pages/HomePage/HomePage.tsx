import { Link } from "react-router-dom"


export const HomePage: React.FC = () => {
    console.log('hi')

    return (
        <div>
            <h1>Home Screen</h1>

            <button>Create Lobby</button>
            <Link to='/game'>To Game</Link>
            <button ></button>
        </div>
    )
}