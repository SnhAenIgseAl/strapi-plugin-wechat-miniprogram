export default {
    "kind": 'singleType',
    "collectionName": "wechat_configs",
    "info": {
        "singularName": "wechat-configs",
        "pluralName": "wechat-configs",
        "displayName": "WeChatConfig",
        "tableName": 'WeChatConfig'
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
        "app_id": {
            "type": "string",
            "configurable": true,
            "required": true,
            "default": null
        },
        "app_secret": {
            "type": "string",
            "configurable": true,
            "required": true,
            "default": null
        }
    }
}