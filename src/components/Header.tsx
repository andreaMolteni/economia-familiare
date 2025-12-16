import React from "react";
import {
    AppBar,
    Toolbar,
    Typography
} from "@mui/material";

const ResumeData: React.FC = () => {

    return (
        <AppBar position="static" color="primary" elevation={0} sx={{
            borderRadius: 0
        }} >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Economia Familiare
                </Typography>

                <Typography
                    variant="body1"
                    sx={{ textDecoration: "underline", cursor: "pointer" }}
                >
                    header
                </Typography>
            </Toolbar>
        </AppBar>
    );
}


export default ResumeData;