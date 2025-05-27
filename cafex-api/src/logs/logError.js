import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logPath = path.join(__dirname, './error.log');

export function logError(err){
    const msg = `[${new Date().toISOString()}] ${err.stack || err.message}\n`;
    fs.appendFileSync(logPath, msg);
}