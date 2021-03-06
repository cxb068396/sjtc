var app = getApp();

const promisic = function (func) {
	return function (params = {}) {
		return new Promise((resolve, reject) => {
			const args = Object.assign(params, {
				success: res => resolve(res),
				fail: err => reject(err)
			})
			func(args)
		})
	}
}
module.exports = {
	promisic: promisic,
}