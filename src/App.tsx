import React from "react";
import {
    Box,
    Paper
} from "@mui/material";
import IncomeTable from "./components/IncomeTable";
import ExpensesTable from "./components/ExpensesTable";
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
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" }, // colonna su mobile, affiancate da md in su
                        gap: 3,
                        alignItems: "stretch",
                        width: "100%",
                    }}
                >
                    {/* Colonna sinistra: Entrate */}
                    <Box sx={{ flex: 1 }}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                            <IncomeTable />
                        </Paper>
                    </Box>

                    {/* Colonna destra: Uscite */}
                    <Box sx={{ flex: 1 }}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                            <ExpensesTable />
                        </Paper>
                    </Box>
                </Box>
            </Box>

            {/* FOOTER */}
            <Footer />
        </Box>
    );
};

export default App;
