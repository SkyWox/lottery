module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			firstname: {
				type: Sequelize.STRING,
				allowNull: false
			},
			lastname: {
				type: Sequelize.STRING,
				allowNull: false
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false
			},
			admin: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			isEmailVerified: {
				type: Sequelize.BOOLEAN,
				allowNull: false
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
	down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('Users')
}
