export default [
	{
		method: 'POST',
		path: '/login',
		handler: 'controller.login',
		config: {
			auth: false
		}
	},
	{
		method: 'POST',
		path: '/getPhoneNumber',
		handler: 'controller.getPhoneNumber',
		config: {
			auth: false
		}
	},
	{
		method: 'POST',
		path: '/auth/update',
		handler: 'controller.update',
	},
	{
		method: 'POST',
		path: '/auth/openid',
		handler: 'controller.openid',
		config: {
			auth: false
		}
	}
];
