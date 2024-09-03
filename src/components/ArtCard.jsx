import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArtData from './ArtData.json'

export default function MediaCard() {
    return (
        <Card sx={{ maxWidth: 250 }}>
            <CardMedia

            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Untitled
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Artist Name
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    2023
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}
