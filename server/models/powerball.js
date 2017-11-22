module.exports = (sequelize, DataTypes) => {
	const Powerball = sequelize.define('Powerball', {
		date: {
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
			type: DataTypes.DATE
		},
		numbers: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		powerplay: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		hadwinner: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE
		}
	})
	return Powerball
}
