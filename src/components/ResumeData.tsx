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
import { getNextAvailableDayOfMonth, diffInDays, formatDDMMYYYYtoYYYYMMDD, formatYYYYMMDDtoDDMMYYYY } from '../utils/dateUtils';
import type { RootState } from "../app/store";
import { getDateDDMMYYYY, getDateYYYYMMDD, stringToDate } from "../utils/dateUtils";
import { setClosingDay, setDayCountDown } from "../slices/dateSlice";
import { setBudget } from "../slices/moneySlice";




const ResumeData: React.FC = () => {
    const dispatch = useDispatch();

    // data di oggi
    const currentDate = useSelector((state: RootState) => state.date.currentDate);
    const closingDay = useSelector((state: RootState) => state.date.closingDay);
    const dayCountDown = useSelector((state: RootState) => state.date.dayCountDown);
    // data di chiusura del mese contabile:
    const fixedDate: Date = getNextAvailableDayOfMonth(stringToDate(currentDate), closingDay);
    const balance: number = useSelector((state: RootState) => state.money.balance);
    const budget: number = useSelector((state: RootState) => state.money.budget);
    const remainingExpenses: number = useSelector((state: RootState) => state.money.remainingExpenses);
    const remainingIncome: number = useSelector((state: RootState) => state.money.remainingIncome);


    console.log("fine: ", stringToDate(getDateYYYYMMDD(fixedDate)));
    console.log("inzio: ", stringToDate(currentDate));
    console.log("mancano: ", diffInDays(stringToDate(getDateYYYYMMDD(fixedDate)), stringToDate(currentDate)));

    dispatch(setDayCountDown(diffInDays(stringToDate(getDateYYYYMMDD(fixedDate)), stringToDate(currentDate))));

    const calculateBudget = (
        remainingIncome: number,
        remainingExpenses: number,
        balance: number,
        remainingDay: number
    ): number => {
        return (remainingIncome + balance - remainingExpenses) / remainingDay;
    };

    dispatch(setBudget(calculateBudget(remainingIncome, remainingExpenses, balance, dayCountDown)));

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
                            Oggi è il {formatYYYYMMDDtoDDMMYYYY(currentDate)}
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
                                        Il saldo disponibile sul tuo conto è <b>{balance.toFixed(2)} €</b>
                                    </ListItemText>
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText>
                                        <Typography
                                            component="span"
                                            sx={{ color: 'text.primary', display: 'inline' }}
                                        />
                                        Il tuo budget giornaliero è di <b>{budget.toFixed(2)} €</b>
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