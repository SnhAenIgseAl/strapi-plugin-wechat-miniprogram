import type { Core } from '@strapi/strapi';
import { useFetch } from '../utils/useFetch';

declare const window: {
	location: any;
} & Window;

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
	getWelcomeMessage() {
		return 'Welcome to Strapi 🚀';
	},
	getRandomPassword(length: number) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	},
	sanitizeUser(user, ctx){
		const { auth } = ctx.state;
		const userSchema = strapi.getModel('plugin::users-permissions.user');
	
		return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
	}
});

export default service;
