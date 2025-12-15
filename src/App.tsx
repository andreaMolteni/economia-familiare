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
import { useDispatch, useSelector } from "react-redux";
import { getNextAvailableDayOfMonth } from './utils/dateUtils';
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
    const fixedDate: Date = getNextAvailableDayOfMonth(currentDate, closingDay);

    //const contDown: number = 31;

    dispatch(setDayCountDown(26));

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
                <Paper
                    sx={{
                        borderRadius: 4,
                        border: "2px solid",
                        borderColor: "primary.main",
                        p: 2,
                        mb: 2,
                    }}
                >
                    <Grid container spacing={2}>
                        {/* Sinistra */}
                        <Grid
                            size={{xs:8}}
                        >
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}
                            >
                                Ciao {userName}
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 600, color: "primary.main", mb: 1 }}
                            >
                                Oggi è il {getDateDDMMYYYY(currentDate)}
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 600, color: "primary.main" }}
                            >
                                Il mese contabile si chiude il  <br /> {getDateDDMMYYYY(fixedDate)}
                            </Typography>
                        </Grid>

                        {/* Centro */}
                        <Grid
                            size={{xs: 4}}
                        >
                            <Paper elevation={5}
                                sx={{
                                    elevation:12,
                                    borderRadius: 2,
                                    border: "2px solid",
                                    borderColor: "primary.main",
                                    p: 1,
                                    mb: 2,
                                }}
                            >
                                <List sx={{ width: '100%', hight: '100%', bgcolor: 'background.paper' }}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText>
                                            <Typography
                                                component="span"
                                                sx={{ color: 'text.primary', display: 'inline' }}
                                            />
                                            Mancano <b>{dayCountDown}</b> giorni alla chiusura del mese contabile
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText>
                                            <Typography
                                                component="span"
                                                sx={{ color: 'text.primary', display: 'inline' }}
                                            />
                                            Il saldo disponibile sul tuo conto è <b>2100.32€</b>
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText>
                                            <Typography 
                                                component="span"
                                                sx={{ color: 'text.primary', display: 'inline' }}
                                            />
                                            Il tuo budget giornaliero è di <b>54.32€</b>
                                        </ListItemText>
                                    </ListItem>
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>

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
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Tabella entrate
                            </Typography>
                            <IncomeTable />
                        </Paper>
                    </Box>

                    {/* Colonna destra: Uscite */}
                    <Box sx={{ flex: 1 }}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Tabella uscite
                            </Typography>
                            <ExpensesTable />
                        </Paper>
                    </Box>
                </Box>
            </Box>

            {/* FOOTER */}
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
        </Box>
    );
};

export default App;
