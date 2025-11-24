import type { Core } from '@strapi/strapi';

const getService = (name: string) => {
	return strapi.plugin('users-permissions').service(name);
}

const getPluginService = (name: string) => {
	return strapi.plugin('strapi-plugin-wechat-miniprogram').service(name);
}

const sanitizeUser = (user, ctx) => {
	const { auth } = ctx.state;
	const userSchema = strapi.getModel('plugin::users-permissions.user');

	return strapi.contentAPI.sanitize.output(user, userSchema, { auth });
};

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
	async index(ctx) {
		ctx.body = strapi
			.plugin('strapi-plugin-wechat-miniprogram')
			// the name of the service file & the method.
			.service('service')
			.getWelcomeMessage();
	},

	async createUserByOpenid(openid: string, ctx) {
		const user = await strapi.documents('plugin::strapi-plugin-wechat-miniprogram.wechat-users').findFirst({
			filters: {
				openid: openid
			},
			populate: 'user'
		})

		if (!user) {
			const role = await strapi.documents('plugin::users-permissions.role').findFirst({
				filters: {
					name: 'Authenticated'
				}
			})

			const password = getPluginService('service').getRandomPassword(16)
			const newUser = await strapi.documents('plugin::users-permissions.user').create({
				data: {
					username: openid,
					email: openid + '@example.com',
					password: password,
					confirmed: true,
					role: role.documentId
				},
				status: 'published'
			})

			await strapi.documents('plugin::strapi-plugin-wechat-miniprogram.wechat-users').create({
				data: {
					openid: openid,
					user: newUser.documentId
				},
				status: 'published'
			})

			return {
				jwt: getService('jwt').issue({ id: newUser.id }),
				user: await sanitizeUser(newUser, ctx)
			}
		}

		return {
			jwt: getService('jwt').issue({ id: user.user.id }),
			user: await sanitizeUser(user.user, ctx)
		}
	},

	async createUserByPhone(phoneNumber: string, openid: string, ctx) {
		const user = await strapi.documents('plugin::strapi-plugin-wechat-miniprogram.wechat-users').findFirst({
			filters: {
				phone: phoneNumber
			},
			populate: 'user'
		})

		if (!user) {
			const role = await strapi.documents('plugin::users-permissions.role').findFirst({
				filters: {
					name: 'Authenticated'
				}
			})

			const password = getPluginService('service').getRandomPassword(16)
			const newUser = await strapi.documents('plugin::users-permissions.user').create({
				data: {
					username: phoneNumber,
					email: phoneNumber + '@example.com',
					password: password,
					confirmed: true,
					role: role.documentId
				},
				status: 'published'
			})

			await strapi.documents('plugin::strapi-plugin-wechat-miniprogram.wechat-users').create({
				data: {
					openid: openid,
					phone: phoneNumber,
					user: newUser.documentId
				},
				status: 'published'
			})

			return {
				jwt: getService('jwt').issue({ id: newUser.id }),
				user: await sanitizeUser(newUser, ctx)
			}
		}

		return {
			jwt: getService('jwt').issue({ id: user.user.id }),
			user: await sanitizeUser(user.user, ctx)
		}
	},

	async login(ctx) {
		const { openidCode, phoneCode } = ctx.request.body
		if (!openidCode) {
			ctx.throw(400, '缺少 openidCode 参数');
		}

		const appInfo = await strapi.documents('plugin::strapi-plugin-wechat-miniprogram.wechat-configs').findMany()
		if (appInfo.length === 0) {
			ctx.throw(400, '请先配置微信小程序信息');
		}
		
		const id = appInfo[0].app_id
		const secret = appInfo[0].app_secret

		const openidData = await getPluginService('service').getOpenidData(id, secret, openidCode)
		if (!openidData.openid) {
			ctx.throw(400, openidData.errmsg);
		}

		const { openid } = openidData
		let phoneNumber = ''
		
		if (phoneCode) {
			const phoneData = await getPluginService('service').getPhoneData(id, secret, phoneCode)
			if (phoneData.errcode !== 0) {
				ctx.throw(400, phoneData.errmsg);
			}

			phoneNumber = phoneData.phone_info.purePhoneNumber

			const res = await this.createUserByPhone(phoneNumber, openid, ctx)
			return res
		} else {
			const res = await this.createUserByOpenid(openid, ctx)
			return res
		}
	},

	async getPhoneNumber(ctx) {
		const { code } = ctx.request.body

		const appInfo = await strapi.documents('plugin::strapi-plugin-wechat-miniprogram.wechat-configs').findMany()
		
		if (appInfo.length === 0) {
			ctx.throw(400, '请先配置微信小程序信息');
		}
		
		const appId = appInfo[0].app_id
		const appSecret = appInfo[0].app_secret

		const { access_token } = await new Promise<any>((resolve, reject) => {
			fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`)
				.then(res => res.json())
				.then(res => {
					resolve(res)
				})
		})

		const phoneData = await new Promise((resolve, reject) => {
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

	async update(ctx) {
		const user = ctx.state.user
		const { data } = ctx.request.body

		const info = await strapi.documents('plugin::users-permissions.user').findOne({
			documentId: user.documentId,
			populate: 'wechat_user'
		})

		try {
			const res = await strapi.documents('plugin::strapi-plugin-wechat-miniprogram.wechat-users').update({
				documentId: info.wechat_user.documentId,
				data: {
					...data
				},
				status: 'published'
			})

			return {
				code: 0,
				message: '更新成功',
				data: res
			}
		} catch (err) {
			return {
				code: -1,
				message: err,
				data: null
			}
		}
	},

	async openid(ctx) {
		const { code } = ctx.request.body

		const appInfo = await strapi.documents('plugin::strapi-plugin-wechat-miniprogram.wechat-configs').findMany()
		
		if (appInfo.length === 0) {
			ctx.throw(400, '请先配置微信小程序信息');
		}
		
		const id = appInfo[0].app_id
		const secret = appInfo[0].app_secret

		const data = await new Promise<any>((resolve, reject) => {
			fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${id}&secret=${secret}&js_code=${code}&grant_type=authorization_code`)
				.then(res => res.json())
				.then(res => {
					resolve(res as any)
				})
		})

		if (!data.openid) {
			ctx.throw(400, 'code 无效');
		}

		return data
	}
});

export default controller;
