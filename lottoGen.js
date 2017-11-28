lottoGen = function(specs) {
	var lottoNums = {
		vanilla: [],
		special: 0
	}

	var num = Math.ceil(Math.random() * specs.vanillaMax)

	for (i = 0; i < specs.numVanilla; i++) {
		while (lottoNums.vanilla.indexOf(num) !== -1) {
			num = Math.ceil(Math.random() * specs.vanillaMax)
		}
		lottoNums.vanilla.push(num)
	}

	lottoNums.vanilla.sort(function(a, b) {
		return a - b
	})

	if (specs.numSpecial > 0) {
		lottoNums.special = Math.ceil(Math.random() * specs.specialMax)
	}

	return lottoNums
}

module.exports = lottoGen
