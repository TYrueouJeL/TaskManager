import Connected from '../components/home/Connected.tsx';
import {getActualUser} from "../services/api.ts";
import Disconected from "../components/home/Disconnected.tsx";
import {useState} from "react";

export default function Home() {
    const [user, setUser] = useState(null)
    // vérifier la connexion de l'utilisateur
    getActualUser().then((data) => {
        setUser(data)
    }).catch((error) => {
        console.log(error)
    })

    return (
        <>
            {user ? <Connected /> : <Disconected/>}
        </>
    )
}