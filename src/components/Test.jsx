import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { Button } from "@mui/material";

function Test() {
    const [flip, setFlip] = useState(false);
    return (
        <ReactCardFlip isFlipped={flip}
            flipDirection="vertical">
            <div className="card-font">
                Welcome to GFG.
                <Button color='black' onClick={() => setFlip(!flip)}>
                    Flip</Button>
            </div>
            <div className="card-back">
                Computer Science Portal.
                <Button color='black' onClick={() => setFlip(!flip)}>
                    Back</Button>
            </div>
        </ReactCardFlip>
    );
}

export default Test;