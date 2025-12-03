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

const App: React.FC = () => {
    const monthName = "Dicembre";
    const userName = "Andrea";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "background.default",
                width: "100%",
            }}
        >
            {/* HEADER */}
            <AppBar position="static" color="primary" elevation={0}>
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
                        p: 3,
                        mb: 4,
                    }}
                >
                    <Grid container spacing={2}>
                        {/* Sinistra */}
                        <Grid
                            item
                            xs={12}
                            md={4}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
                            >
                                {monthName}
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 600, color: "primary.main" }}
                            >
                                Ciao {userName}
                            </Typography>
                        </Grid>

                        {/* Centro */}
                        <Grid
                            item
                            xs={12}
                            md={4}
                            sx={{
                                borderLeft: { md: "2px solid primary.main" },
                                borderRight: { md: "2px solid primary.main" },
                                px: 2,
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
                            >
                                Oggi è il 3 dicembre 2025
                            </Typography>

                            <List dense sx={{ pl: 2 }}>
                                <ListItem sx={{ py: 0.3 }}>
                                    <ListItemText
                                        primary={
                                            <>
                                                Il saldo disponibile sul tuo conto è <b>2100.32€</b>
                                            </>
                                        }
                                    />
                                </ListItem>

                                <ListItem sx={{ py: 0.3 }}>
                                    <ListItemText
                                        primary={
                                            <>
                                                Mancano <b style={{ color: "green" }}>12</b> giorni al
                                                prossimo mese contabile
                                            </>
                                        }
                                    />
                                </ListItem>

                                <ListItem sx={{ py: 0.3 }}>
                                    <ListItemText
                                        primary={
                                            <>
                                                Il tuo budget giornaliero è{" "}
                                                <b style={{ color: "green" }}>50.00€</b>
                                            </>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Grid>

                        {/* Destra */}
                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
                            >
                                Ieri
                            </Typography>

                            <List dense sx={{ pl: 2 }}>
                                <ListItem sx={{ py: 0.3 }}>
                                    <ListItemText
                                        primary={
                                            <>
                                                Le tue spese sono state di{" "}
                                                <b style={{ color: "green" }}>60.32€</b>
                                            </>
                                        }
                                    />
                                </ListItem>

                                <ListItem sx={{ py: 0.3 }}>
                                    <ListItemText
                                        primary={
                                            <>10€ in più/di meno rispetto al tuo budget</>
                                        }
                                    />
                                </ListItem>

                                <ListItem sx={{ py: 0.3 }}>
                                    <ListItemText
                                        primary={
                                            <>
                                                Il tuo budget giornaliero è variato di <b>2€</b>
                                            </>
                                        }
                                    />
                                </ListItem>
                            </List>
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
