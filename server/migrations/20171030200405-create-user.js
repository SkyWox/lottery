module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
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
			contactwin: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			contactlose: {
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
