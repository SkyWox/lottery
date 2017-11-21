module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable('Tickets', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			numbers: {
				type: Sequelize.ARRAY(Sequelize.INTEGER),
				allowNull: false
			},
			lottoname: {
				type: Sequelize.STRING,
				allowNull: false
			},
			lottodate: {
				type: Sequelize.DATEONLY,
				allowNull: false
			},
			winchecked: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			winner: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			contacted: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			userID: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'Users',
					key: 'id',
					as: 'userID'
				}
			}
		}),
	down: (queryInterface /* , Sequelize */) =>
		queryInterface.dropTable('Tickets')
}
