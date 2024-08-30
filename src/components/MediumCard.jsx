import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function MediumCard() {
    return (
        <Card sx={{ maxWidth: 250 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    src="./Images/c1.jpg"
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Painting
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
