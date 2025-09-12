import mysql from "mysql2/promise"

async function query(sql:string,params:any){
    const connection = await mysql.createConnection({host:"localhost",user:"root",password:"Lunacap21",database:"shopapp"});
    const [results]=await connection.query(sql,params);
    return results
}

export default{
    query
}