import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import IncomeTable from "./components/IncomeTable";
import ExpensesTable from "./components/ExpensesTable";
import ResumeData from "./components/ResumeData";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getNextAvailableDayOfMonth, stringToDate } from './utils/dateUtils';
import type { RootState } from "./app/store";
import { getDateDDMMYYYY } from "./utils/dateUtils";
import { setClosingDay, setDayCountDown } from "./slices/dateSlice";


const App: React.FC = () => {
    const dispatch = useDispatch();


    const monthName = "Dicembre";
    const userName = "Andrea";

    const currentDate = useSelector((state: RootState) => state.date.currentDate);
    const closingDay = useSelector((state: RootState) => state.date.closingDay);
    const dayCountDown = useSelector((state: RootState) => state.date.dayCountDown);
    const fixedDate: Date = getNextAvailableDayOfMonth(stringToDate(currentDate), closingDay);

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
