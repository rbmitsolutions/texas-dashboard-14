import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        setupFiles: ['./src/common/libs/vitest/index.tsx'],
        reporters: ['json', 'html', 'default'],
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
        coverage: {
            enabled: true,
            reporter: ['html', 'json'],
        }
    },
    resolve: {
        alias: {
            '@/': '/src/'
        }
    }
})