/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{jsx, html, js}"],
	theme: {
		extend: {},
		screens: {
			notebook: "769px",
			// => @media (min-width: 768px) { ... }

			monitor: "1441px",
			// => @media (min-width: 1024px) { ... }
		},
	},
	plugins: [],
};
