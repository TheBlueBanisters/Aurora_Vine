import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import Database from 'better-sqlite3';

const appRoot = app.getAppPath();
const dbPath = path.join(appRoot, 'data', 'school_item.db');

export function getReadOnlyDb() {
  if (!fs.existsSync(dbPath)) return null;
  return new Database(dbPath, { readonly: true });
}

export function getWritableDb() {
  return new Database(dbPath);
}
