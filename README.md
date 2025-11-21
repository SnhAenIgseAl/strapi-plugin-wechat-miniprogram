# strapi-plugin-wechat-miniprogram
适用于 strapi v5 微信小程序 api 插件  
此插件会创建一个集合表 WechatUser 和一个简单表 WechatConfig，其中 WechatUser 表为微信用户表，字段 user 与 User 表 wechat_user 关联；WechatConfig 表为微信小程序配置，可设置 appId 和 appSecret。

## 安装
`npm i strapi-plugin-wechat-miniprogram`

## 微信登录
- 路径：
`STRAPI_URL/api/strapi-plugin-wechat-miniprogram/login`
- 参数：
  
| 参数名  | 类型  | 是否必须  |
| ------------ | ------------ | :----------: |
| code  | string  | √ |
- 权限： `public`  
  
请求成功后返回 jwt 和 user 信息，等同于 strapi 用户。

## 获取手机号
注意，获取手机号的code与wx.login()获取的code不是同一方式。  
### uniapp

```html [wxml]
<template>
    <button open-type="getPhoneNumber" @getphonenumber="getphonenumber">获取手机号</button>
</template>

<script setup lang="ts">
const getphonenumber = (e) => {
    const code = e.detail.code
}
</script>
```

- 路径： `STRAPI_URL/api/strapi-plugin-wechat-miniprogram/getPhoneNumber`
- 参数：
  
| 参数名  | 类型  | 是否必须  |
| ------------ | ------------ | :----------: |
| code  | string  | √ |
- 权限： `public`

## 获取openid
- 路径： `STRAPI_URL/api/strapi-plugin-wechat-miniprogram/auth/openid`
- 参数：
  
| 参数名  | 类型  | 是否必须  |
| ------------ | ------------ | :----------: |
| code  | string  | √ |
- 权限： `public`

## 更改信息
- 路径： `STRAPI_URL/api/strapi-plugin-wechat-miniprogram/auth/update`
- 请求头：`Authorization: Bearer USER_TOKEN`
- 参数：
  
| 参数名  | 类型  | 是否必须  |
| ------------ | ------------ | ------------ |
| nickname  | string  |  |
| avatar  | string  |  |
| phone  | string  |  |  
- 权限： `Authenticated`  