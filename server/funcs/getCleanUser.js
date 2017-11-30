function getCleanUser(user) {
	if (!user) return {}

	var u = user.toJSON()
	return {
		userid: u.id,
		email: u.email,
		admin: u.admin,
		contactwin: u.contactwin,
		contactlose: u.contactlose,
		isEmailVerified: u.isEmailVerified,
		createdAt: u.createdAt,
		updatedAt: u.updatedAt,
		image: u.image,
		isEmailVerified: u.isEmailVerified
	}
}
module.exports = getCleanUser
