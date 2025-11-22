# strapi-plugin-wechat-miniprogram
适用于 strapi v5 微信小程序 api 插件  
此插件会创建一个集合表 WechatUser 和一个简单表 WechatConfig，其中 WechatUser 表为微信用户表，字段 user 与 User 表 wechat_user 关联；WechatConfig 表为微信小程序配置，可设置 appId 和 appSecret。

## 安装
`npm i strapi-plugin-wechat-miniprogram`

## openid 微信登录
- 方法：`POST`
- 路径：`STRAPI_URL/api/strapi-plugin-wechat-miniprogram/login`
- body 参数：
  
| 参数名  | 类型  | 是否必须  |
| ------------ | ------------ | :----------: |
| code  | string  | √ |
- 权限： `public`  
  
请求成功后返回 jwt 和 user 信息，等同于 strapi 用户。
``` json
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzYzNzkxNjMyLCJleHAiOjE3NjYzODM2MzJ9.xoZjtImtn1klQoLL5Xrrcvcy5KnPFDMaHvcAHGUtx0c",
    "user": {
        "id": 7,
        "documentId": "bavikfbi4okjwoc5qq720x56",
        "username": "obDKA13HPuz9C5BWppYpRm1uJ9Cs",
        "email": "obDKA13HPuz9C5BWppYpRm1uJ9Cs@qq.com",
        "provider": null,
        "confirmed": true,
        "blocked": false,
        "createdAt": "2025-11-20T09:57:03.063Z",
        "updatedAt": "2025-11-20T09:57:03.063Z",
        "publishedAt": "2025-11-20T09:57:02.997Z"
    }
}
```

## 获取手机号

注意，获取手机号的code与wx.login()获取的code不是同一方式。

### uniapp
```
<template>
    <button open-type="getPhoneNumber" @getphonenumber="getphonenumber">获取手机号</button>
</template>

<script setup lang="ts">
const getphonenumber = (e) => {
    const code = e.detail.code
}
</script>
```

- 方法：`POST`
- 路径：`STRAPI_URL/api/strapi-plugin-wechat-miniprogram/getPhoneNumber`
- body 参数：
  
| 参数名  | 类型  | 是否必须  |
| ------------ | ------------ | :----------: |
| code  | string  | √ |
- 权限： `public`  

响应结果等同于微信官方文档
``` json
{
    "errcode": 0,
    "errmsg": "ok",
    "phone_info": {
        "phoneNumber": "XXXXXXXXXXX",
        "purePhoneNumber": "XXXXXXXXXXX",
        "countryCode": "86",
        "watermark": {
            "timestamp": 1763791978,
            "appid": "wxXXXXXXXXXXXX"
        }
    }
}
```

## 获取openid
- 方法：`POST`
- 路径：`STRAPI_URL/api/strapi-plugin-wechat-miniprogram/auth/openid`
- body 参数：
  
| 参数名  | 类型  | 是否必须  |
| ------------ | ------------ | :----------: |
| code  | string  | √ |
- 权限： `public`

响应结果等同于微信官方文档
``` json
{
    "session_key": "kkniNl6BcQVLFIoM37vg8g==",
    "openid": "obDKA13HPuz9C5BWppYpRm1uJ9Cs"
}
```

## 更改信息
- 方法：`POST`
- 路径： `STRAPI_URL/api/strapi-plugin-wechat-miniprogram/auth/update`
- 请求头：`Authorization: Bearer USER_TOKEN`
- body 参数：
  
| 参数名  | 类型  | 是否必须  |
| ------------ | ------------ | ------------ |
| nickname  | string  |  |
| avatar  | string  |  |
| phone  | string  |  |  
- 权限： `Authenticated`  

``` json
{
    "code": 0,
    "message": "更新成功",
    "data": {
        "id": 9,
        "documentId": "mmr74jzbknf740spef1vka6m",
        "openid": "obDKA13HPuz9C5BWppYpRm1uJ9Cs",
        "nickname": "理塘策马大王",
        "avatar": null,
        "phone": null,
        "createdAt": "2025-11-20T09:57:03.073Z",
        "updatedAt": "2025-11-22T06:17:46.975Z",
        "publishedAt": "2025-11-22T06:17:46.985Z",
        "locale": null
    }
}
```