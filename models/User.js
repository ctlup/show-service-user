import pool from "../db_driver";

export class User {
    User(userData={}) {
        this.id = userData.id || null;
        this.name = userData.name && userData.name.trim();
        this.surname = userData.surname && userData.surname.trim();
        this.email = userData.email && userData.email.trim();
        this.phone = userData.phone && userData.email.trim();
        this.address = userData.address && userData.address.trim();
        this.pwd_hash = userData.pwd_hash && userData.trim();
    }
    static async deleteById(id) {
        throw new Error("Not Implemented")
    }
    static async deactivateByEmail(email) {
        throw new Error("Not Implemented")
    }
    static async getById(id) {
        if(!id) throw new Error("User ID is not specified");
        const text = "SELECT * FROM User WHERE ID=$1;";
        const values = [id];
        const res = await pool.query(text, values);
        const user = new User(res.rows[0])
        return user; 
    }
    static async getByEmail(email) {
        if(!email) throw new Error("User ID is not specified");
        const text = "SELECT * FROM User WHERE email=$1;";
        const values = [email];
        const res = await pool.query(text, values);
        const user = new User(res.rows[0])
        return user; 
    }

    static async create(userData) {
        const user = new User(userData)
        await user.create()
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
        const text = `INSERT INTO User(name, surname, email, phone, pwd_hash, signup_time, last_login_time, address)
                      VALUES($1, $2, $3, $4, $5, $6, $7, $8)`;
        const values = [this.name, this.surname, this.email, this.phone, this.pwd_hash, ];
        // TODO Fill the values
    }
}