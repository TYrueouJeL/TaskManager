import Connected from '../components/home/Connected.tsx';
import {getActualUser} from "../services/api.ts";
import Disconected from "../components/home/Disconnected.tsx";
import {useState} from "react";

export default function Home() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    getActualUser().then((data) => {
        setUser(data)
        setLoading(false)
    }).catch((error) => {
        console.log(error)
        setLoading(false)
    })

    return (
        <>
            {loading ? <div>Loading...</div> : user ? <Connected /> : <Disconected/>}
        </>
    )
}