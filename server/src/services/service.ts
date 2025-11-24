import type { Core } from '@strapi/strapi';

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
	async getPhoneData(id: string, secret: string, code: string) {
		const { access_token } = await new Promise<any>((resolve, reject) => {
			fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${id}&secret=${secret}`)
				.then(res => res.json())
				.then(res => {
					resolve(res)
				})
		})

		const phoneData = await new Promise<any>((resolve, reject) => {
			fetch(`https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${access_token}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					code
				})
			})
				.then(res => res.json())
				.then(res => {
					resolve(res)
				})
		})

		return phoneData
	},
	async getOpenidData(id: string, secret: string, code: string) {
	    const data = await new Promise<any>((resolve, reject) => {
			fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${id}&secret=${secret}&js_code=${code}&grant_type=authorization_code`)
				.then(res => res.json())
				.then(res => {
					resolve(res as any)
				})
		})

		return data
	},
	sanitizeUser(user, ctx){
		const { auth } = ctx.state;
		const userSchema = strapi.getModel('plugin::users-permissions.user');
	
		return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
	}
});

export default service;
