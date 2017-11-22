var requireText = require('require-text')
const boilerplatetop = requireText('../../emails/boilerplatetop.html', require)
const boilerplatebottom = requireText(
	'../../emails/boilerplatebottom.html',
	require
)
const someoneelsestripped = requireText(
	'../../emails/someoneElseStripped.html',
	require
)
const youwonstripped = requireText('../../emails/YouWonStripped.html', require)
const potincreasestripped = requireText(
	'../../emails/PotIncreaseStripped.html',
	require
)

module.exports = {
	build: function(template, username, lottoname, winningnums, yournums) {
		var content = ''
		switch (template) {
			case 'someoneElseWon':
				content = someoneelsestripped
				break
			case 'youwon':
				content = youwonstripped
				break
			case 'potincrease':
				content = potincreasestripped
				break
		}
		content = content
			.replace('[username]', username)
			.replace('[lottoname]', lottoname)
			.replace('[winningnums]', winningnums.toString())
			.replace('[yournums]', yournums.toString())
		return boilerplatetop + content + boilerplatebottom
	}
}
