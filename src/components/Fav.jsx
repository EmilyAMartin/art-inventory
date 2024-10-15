import React from 'react'
import { useState } from "react";
import { FavoriteBorder } from '@mui/icons-material';
import { Favorite } from '@mui/icons-material';


const Fav = ({ item }) => {
    const [favorite, setFavorite] = useState(false);
    const toggleFavorite = () => setFavorite((favorite) => !favorite);
    return (
        <div>
            <span>{item.title}</span>
            <span>{item.description}</span>
            <span onClick={toggleFavorite}>
                {favorite ? <FavoriteBorder /> : <Favorite />}
            </span>
        </div>
    );
};

export default Fav