import {useContext} from "react";
import {GridContexts} from "./contexts/gridContexts";

export default function Comp(){

    const message = useContext(GridContexts)

    return(
        <>
            <h1>stars in the roof, ohhh</h1>
            <h1>{message}</h1>
        </>
    )
}