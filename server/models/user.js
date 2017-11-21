module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		username: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		}
	})
	User.associate = models => {
		User.hasMany(models.Ticket, {
			foreignKey: 'userID',
			as: 'tickets'
		})
	}
	return User
}
