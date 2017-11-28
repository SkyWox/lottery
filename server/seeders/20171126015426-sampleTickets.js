'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			'Users',
			[
				{
					firstname: 'Pasta',
					lastname: 'Boy',
					email: 'lenin1916@gmail.com',
					password: 'password',
					admin: false,
					isEmailVerified: true,
					createdAt: '2017-11-08',
					updatedAt: '2017-11-08'
				}
			],
			{}
		)
		return queryInterface.bulkInsert(
			'Tickets',
			[
				{
					numbers: '{55, 55, 55, 55, 55, 55}',
					lottoname: 'powerball',
					lottodate: '2017-11-08',
					contacted: false,
					userID: 1,
					createdAt: '2017-11-08',
					updatedAt: '2017-11-08'
				}
			],
			{}
		)
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Users', null, {})
	}
}
