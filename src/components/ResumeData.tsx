import React from "react";
import {
    Typography,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getNextAvailableDayOfMonth } from '../utils/dateUtils';
import type { RootState } from "../app/store";
import { getDateDDMMYYYY } from "../utils/dateUtils";
import { setClosingDay, setDayCountDown } from "../slices/dateSlice";



const ResumeData: React.FC = () => {
    const dispatch = useDispatch();

    const currentDate = useSelector((state: RootState) => state.date.currentDate);
    const closingDay = useSelector((state: RootState) => state.date.closingDay);
    const dayCountDown = useSelector((state: RootState) => state.date.dayCountDown);
    const fixedDate: Date = getNextAvailableDayOfMonth(currentDate, closingDay);

    dispatch(setDayCountDown(26));

    const userName = "Andrea";

    return (
        <div>
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
                        size={{ xs: 8 }}
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
                        size={{ xs: 4 }}
                    >
                        <Paper elevation={5}
                            sx={{
                                elevation: 12,
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
        </div>
        );

};

export default ResumeData;