import mysql from 'mysql2/promise';

const url = process.env.MYSQL_URL;
export const dbPool = mysql.createPool(url);
