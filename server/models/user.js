module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		firstname: {
			type: DataTypes.STRING,
			allowNull: false
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		admin: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		isEmailVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		contactwin: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		contactlose: {
			type: DataTypes.BOOLEAN,
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
