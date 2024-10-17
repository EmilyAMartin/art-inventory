import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Popover from '@mui/material/Popover';
import { Favorite } from '@mui/icons-material';
import { FavoriteBorder } from '@mui/icons-material';

const ArtworkCard = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverImageId, setPopoverImageId] = useState(null);
    const handlePopClick = (event) => {
        setAnchorEl(event.currentTarget);
        setPopoverImageId(event.target.src)
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleClose = () => {
        setAnchorEl(null);
        setPopoverImageId(null)
    };
    const handleFavClick = (id) => {
        const updateArtwork = artwork.map((item) => {
            return item.id === id ? { ...item, favorite: !item.favorite } : item;
        })
        setArtwork(updateArtwork);
        const selectedArtwork = updateArtwork.find((art) => art.id === id);
        if (selectedArtwork.favorite === true) {
            const favoritesList =
                JSON.parse(localStorage.getItem("favoritesList")) ?? [];
            favoritesList.push(selectedArtwork);
            localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
        } else if (selectedArtwork.favorite === false) {
            const favoritesList =
                JSON.parse(localStorage.getItem("favoritesList")) ?? [];
            const updatedFavoritesList = favoritesList.filter(
                (art) => art.id !== selectedArtwork.id
            );
            localStorage.setItem(
                "favoritesList",
                JSON.stringify(updatedFavoritesList)
            );
        }
    };
    return (
        <Card sx={{ maxWidth: 300, maxHeight: 600, display: "flex" }}>
            <CardActionArea>
                <CardMedia
                    style={{ width: 300, height: 300 }}
                    component="img"
                    image={`https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`}
                    alt=""
                    onClick={handlePopClick}
                />
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <CardMedia
                        component="img"
                        height="140"
                        image={popoverImageId}
                        alt=""
                    />
                </Popover>
                <CardContent style={{ width: 300, height: 200 }}>
                    <Typography gutterBottom variant="h6" component="div">{art.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.artist_title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.place_of_origin}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.date_end}</Typography>
                </CardContent>
                {art.favorite === true && (
                    <Favorite
                        style={{ margin: 10 }}
                        onClick={() => { handleFavClick(art.id) }}
                    />
                )}
                {(art.favorite === undefined || art.favorite === false) && (
                    <FavoriteBorder
                        style={{ margin: 10 }}
                        onClick={() => { handleFavClick(art.id) }}
                    />
                )}
            </CardActionArea>
        </Card>
    )
}

export default ArtworkCard;