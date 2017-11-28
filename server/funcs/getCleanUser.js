function getCleanUser(user) {
	if (!user) return {}

	var u = user.toJSON()
	return {
		userid: u.id,
		firstname: u.firstname,
		lastname: u.lastname,
		email: u.email,
		admin: u.admin,
		createdAt: u.createdAt,
		updatedAt: u.updatedAt,
		image: u.image,
		isEmailVerified: u.isEmailVerified
	}
}
module.exports = getCleanUser
