export class User {
    User(userData) {
        this.id = userData.id || null;
        this.name = userData.name;
        this.surname = userData.surname;
        this.email = userData.email;
        this.phone = userData.phone;
        this.pwd_hash = userData.pwd_hash;
    }
    static async delete(id) {
        throw new Error("Not Implemented")
    }
    static async get(id) {
        throw new Error("Not Implemented")
    }
    static async getByEmail(email) {
        throw new Error("Not Implemented")
    }

    static async create(userData) {
        const user = new User(userData)
        await user.create()
    }
    async create() {
        throw new Error("Not Implemented")
    }
}