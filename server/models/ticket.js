module.exports = (sequelize, DataTypes) => {
	const Ticket = sequelize.define('Ticket', {
		vanillanums: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		specialnums: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		lottodate: {
			type: DataTypes.STRING,
			allowNull: false
		},
		lottoname: {
			type: DataTypes.STRING,
			allowNull: false
		},
		nocontactreqd: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
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
