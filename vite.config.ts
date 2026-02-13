import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
    react({
        babel: {
        plugins: [['babel-plugin-react-compiler']],
        },
    }),
    ],
    server: {
        proxy: {
            "/me": "http://localhost:8080",
            "/auth": "http://localhost:8080",
            "/users": "http://localhost:8080",
        },
    },
})
