import React from 'react'
import { BsFillHeartFill } from "react-icons/bs";
import "./Card.css"

const Card = () => {
    return (
        <div className='art-card'>
            <h3>Painting</h3>
            <div className='box'> <BsFillHeartFill /></div>
            <h3 >Title</h3>
            <div>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Amet vel quidem dicta nobis deserunt.</div>
        </div>
    )
}

export default Card