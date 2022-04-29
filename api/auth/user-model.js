const db = require("./../../data/dbConfig")

async function add(user) {
	const [id] = await db("users").insert(user);
	return findById(id);
}

function find() {
	return db("users as user")
		.select("user.id", "user.username");
}

function findByUsername(username) {
	return db("users")
		.where({username})
		.first("user.id");
}

function findById(id) {
    return db("users")
        .where({id})
        .first();
}

module.exports = {
	add,
	find,
    findByUsername,
    findById
} 