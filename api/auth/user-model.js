const db = require("./../../data/dbConfig")

async function add(user) {
	const [id] = await db("users").insert(user);
	return findById(id);
}

function find() {
	return db("users as user")
		.select("users.id", "users.username", "users.password");
}

function findByUsername(username) {
	return db("users")
		.where('username',username)
        .first();
}

function findById(id) {
    return db("users")
        .where('id', id)
        .first();
}

module.exports = {
	add,
	find,
    findByUsername,
    findById
} 