import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#2196f3",      // azzurro principale
            light: "#64b5f6",
            dark: "#1976d2",
        },
        secondary: {
            main: "#64b5f6",      // azzurro chiaro
        },
        background: {
            default: "#ffffff",   // sfondo pagina
            paper: "#f7f9fc"      // sfondo card / Paper
        }
    },

    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
        h4: {
            fontWeight: 600,
            color: "#1976d2"
        },
        h6: {
            fontWeight: 600,
            color: "#2196f3"
        }
    },

    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: "16px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: "8px",
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: "#2196f3"    // icone azzurre
                }
            }
        }
    }
});


createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </ThemeProvider>
);
