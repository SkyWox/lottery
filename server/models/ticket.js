module.exports = (sequelize, DataTypes) => {
	const Ticket = sequelize.define('Ticket', {
		numbers: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		winchecked: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		lottodate: {
			type: DataTypes.STRING,
			allowNull: false
		},
		lottoname: {
			type: DataTypes.STRING,
			allowNull: false
		},
		winner: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		contacted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	})
	Ticket.associate = models => {
		Ticket.belongsTo(models.User, {
			foreignKey: 'userID',
			onDelete: 'CASCADE'
		})
	}
	return Ticket
}
