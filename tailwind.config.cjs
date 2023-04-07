const daisyui = require('daisyui');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {},
		fontFamily: {
			cookie: ['cookie']
		}
	},

	plugins: [daisyui]
};

module.exports = config;
