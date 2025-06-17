import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/setupTest.ts'],
        coverage: {
            exclude: [
                '**/*.config.ts',
                '**/*.config.js',
                '**/*types.ts',
                '**/*.d.ts',
                '**/types'

            ],
            thresholds: {
                functions: 80,
                lines: 80,
                branches: 80,
                statements: 80
            }
        }
    }
})