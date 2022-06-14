import pool from "../db_driver.mjs";

export class User {
    constructor(userData={}) {
        console.log(userData)
        this.id = userData.id || null;
        this.name = userData.name && userData.name.trim();
        this.surname = userData.surname && userData.surname.trim();
        this.email = userData.email && userData.email.trim();
        this.phone = userData.phone;
        this.address = userData.address && userData.address.trim();
        this.pwd_hash = userData.pwd_hash
    }
    static async deleteById(id) {
        throw new Error("Not Implemented")
    }
    static async deactivateByEmail(email) {
        throw new Error("Not Implemented")
    }
    static async getById(id) {
        if(!id) throw new Error("User ID is not specified");
        const text = "SELECT name, surname, email, phone, personal_points, address FROM public.\"User\" WHERE ID=$1;";
        const values = [id];
        const res = await pool.query(text, values);
        const user = new User(res.rows[0])
        return user; 
    }
    static async getByEmail(email) {
        if(!email) throw new Error("User ID is not specified");
        const text = "SELECT name, surname, email, phone, personal_points, address FROM public.\"User\" WHERE email=$1;";
        const values = [email];
        const res = await pool.query(text, values);
        const user = new User(res.rows[0])
        return user;
    }

    static async create(userData) {
        const user = new User(userData)
        await user.create()
    }
    static async checkIfExists(email) {
        if(!email) throw new Error("User ID is not specified");
        const text = "SELECT name, surname, email, phone, personal_points, address FROM public.\"User\" WHERE email=$1;";
        const values = [email];
        const res = await pool.query(text, values);
       
        return res.rows[0];
    }
    async create() {
        if( !this.name || 
            !this.surname || 
            !this.email || 
            !this.phone ||
            !this.pwd_hash
        ){
            throw new Error(
                `It is not enough datafields to save the user in the database: 
                name -> ${this.name}
                surname -> ${this.surname}
                email -> ${this.email}
                phone -> ${this.phone}
                pwd_hash -> ${this.pwd_hash}`
            )
        }
        const currTime = new Date()
        const text = 'INSERT INTO public."User"(name, surname, email, phone, pwd_hash, personal_points,signup_time, last_login_time, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);';
        const values = [this.name, this.surname, this.email, this.phone, this.pwd_hash, 100, currTime, currTime, this.address];
        console.log(values)
        const res = await pool.query(text, values);
        return res
    }
}