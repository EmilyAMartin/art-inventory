import React, { useState } from "react";
import { FavoriteBorder } from "@mui/icons-material";
import { Favorite } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const Fv = ({ id }) => {
    const [storageItem, setStorageItem] = useState(() => JSON.parse(localStorage.getItem("favourites") || "[]"))

    const isFavourited = storageItem.includes(id)

    const handleToggleFavourite = () => {
        if (!isFavourited) {

            const newStorageItem = [...storageItem, id]
            setStorageItem(newStorageItem);
            localStorage.setItem("favourites", JSON.stringify(newStorageItem))

        } else {

            const newStorageItem = storageItem.filter((savedId) => savedId !== id)
            setStorageItem(newStorageItem);
            localStorage.setItem("favourites", JSON.stringify(newStorageItem))

        }

        return (
            <IconButton onClick={handleToggleFavourite}>
                {isFavourited ? <Favorite color="error" /> : <FavoriteBorder color="error" />}
            </IconButton>
        );

    }
};

export default Fv;