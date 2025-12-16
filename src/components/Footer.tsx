import React from "react";
import {
    Box,
    Typography
} from "@mui/material";

const Footer: React.FC = () => {

    return (
        <Box
            sx={{
                mt: "auto",
                py: 1.5,
                textAlign: "center",
                backgroundColor: "primary.main",
                color: "#fff",
            }}
        >
            <Typography sx={{ textDecoration: "underline", cursor: "pointer" }}>
                footer
            </Typography>
        </Box>
    );
}


export default Footer;