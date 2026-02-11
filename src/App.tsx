import React from "react";
import {
    Box
} from "@mui/material";

import FinanceDashboard from "./components/FinanceDashboard"
import ResumeData from "./components/ResumeData";
import Header from "./components/Header";
import Footer from "./components/Footer";


const App: React.FC = () => {


    //const contDown: number = 31;

    return (
        <Box
            sx={{
                borderRadius: 0,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "background.default",
                width: "100%",
            }}
        >
            {/* HEADER */}
            <Header />
           

            {/* CONTENUTO PRINCIPALE FULL WIDTH */}
            <Box
                sx={{
                    px: 4,
                    py: 3,
                    flexGrow: 1,
                    width: "100%",
                }}
            >
                {/* BOX RIEPILOGO SUPERIORE */}
                <ResumeData />

                {/* TABELLE AFFIANCATE FULL WIDTH */}
                <FinanceDashboard />
                
            </Box>

            {/* FOOTER */}
            <Footer />
        </Box>
    );
};

export default App;
