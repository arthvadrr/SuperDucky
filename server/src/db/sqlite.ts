import path from 'path';
import Database, {type Database as DatabaseType} from 'better-sqlite3';

const db: DatabaseType = new Database(path.resolve(__dirname, '../../super_ducky.db'), { verbose: console.log });

export default db;