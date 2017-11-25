module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable('Powerballs', {
			date: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.DATE
			},
			numbers: {
				type: Sequelize.ARRAY(Sequelize.INTEGER),
				allowNull: false
			},
			powerplay: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			hadwinner: {
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		}),

	down: (queryInterface /* , Sequelize */) =>
		queryInterface.dropTable('Powerballs')
}
