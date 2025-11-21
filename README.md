# strapi-plugin-wechat-miniprogram
适用于 strapi v5 微信小程序 api 插件
此插件会创建一个集合表WechatUser和一个简单表WechatConfig，其中WechatUser表为微信用户表，字段user与User表wechat_user关联；WechatConfig表为微信小程序配置，可设置appId和appSecret。

## 安装
`npm i strapi-plugin-wechat-miniprogram`

## API接口文档
### 微信登录
- 路径：
`STRAPI_URL/api/strapi-plugin-wechat-miniprogram/login`
- 参数：
| 参数名  | 类型  | 是否必须  |
| ------------ | ------------ | ------------ |
| code  | string  | √ |
- 权限： `public`

### 获取手机号
注意，获取手机号的code与wx.login()获取的code不是同一方式
- 路径： `STRAPI_URL/api/strapi-plugin-wechat-miniprogram/getPhoneNumber`
- 参数：
| 参数名  | 类型  | 是否必须  |
| ------------ | ------------ | ------------ |
| code  | string  | √ |
- 权限： `public`

### 获取openid
- 路径： `STRAPI_URL/api/strapi-plugin-wechat-miniprogram/auth/openid`
- 参数：
| 参数名  | 类型  | 是否必须  |
| ------------ | ------------ | ------------ |
| code  | string  | √ |
- 权限： `public`

### 更改信息
- 路径： `STRAPI_URL/api/strapi-plugin-wechat-miniprogram/auth/update`
- 请求头：`Authorization: Bearer USER_TOKEN`
- 参数：
| 参数名  | 类型  | 是否必须  |
| ------------ | ------------ | ------------ |
| nickname  | string  |  |
| nickname  | string  |  |
| nickname  | string  |  |
- 权限： `Authenticated`