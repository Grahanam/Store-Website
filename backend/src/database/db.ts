import mysql from "mysql2/promise"

const host=process.env.DB_HOST
const user=process.env.DB_USER
const password=process.env.DB_PASS
const database=process.env.DB_NAME

async function query(sql:string,params:any){
    const connection = await mysql.createConnection({host:host,user:user,password:password,database:database});
    const [results]=await connection.query(sql,params);
    return results
}

export default{
    query
}