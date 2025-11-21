export default {
    "kind": 'collectionType',
    "collectionName": "wechat_users",
    "info": {
        "singularName": "wechat-users",
        "pluralName": "wechat-users",
        "displayName": "WeChatUsers",
        "tableName": 'WeChatUsers'
    },
    "options": {
        "draftAndPublish": true
    },
    "pluginOptions": {
        "content-manager": {
            "visible": true
        },
        "content-type-builder": {
            "visible": true
        }
    },
    "attributes": {
        "user": {
            "type": "relation",
            "relation": "oneToOne",
            "target": "plugin::users-permissions.user",
            "inversedBy": "wechat-user"
        },
        "openid": {
            "type": "string",
            "configurable": true,
            "required": true,
            "default": null
        },
        "nickname": {
            "type": "string",
            "configurable": true,
            "required": false,
            "default": null
        },
        "avatar": {
            "type": "string",
            "configurable": true,
            "required": false,
            "default": null
        },
        "phone": {
            "type": "string",
            "configurable": true,
            "required": false,
            "default": null
        }
    }
}