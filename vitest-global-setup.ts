import { execSync } from "node:child_process";

export const setup = async () => {
    console.log('Setting up test database...');
    execSync('docker compose up test-db -d', { stdio: 'inherit' });
    await new Promise(resolve => setTimeout(resolve, 15000));
    console.log('Test database setup complete.');
};

export const teardown = async () => {
    console.log('Tearing down test database...');
    execSync('docker compose down');
    console.log('Test database teardown complete.');
};