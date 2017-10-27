'use strict';
module.exports = {
    "site": {
        "name": "Internal Tools"
    },
    "secret": "pash_e-commerce-secret:AppSecret",
    "database": {
        "db": "mongodb://admin_user:your-password@localhost/internal_tools_db",
        "auth":{
            "user": "pash_admin",
            "pass": "your-password",
            "auth_db": "admin"
        }
    },
    "salt": 'd2g6IOP(U(&Â§)%UÂ§VUIPU(HN%V/Â§Â§URerjh0Ã¼rfqw4zoÃ¶qe54gÃŸ0Ã¤Q"LOU$3wer"', // security salt for hash
    "emblue": {
        "user": "dusername@server.com",
        "pass":"your-password%",
        "app_token":"your-emblue-appkey",
        "api_url": "http://api.embluemail.com/Services/Emblue3Service.svc/json/"
    },
    "zendesk":{
        "e-commerce":{
            "ZDAPIKEY": "your_zendesk-key",
            "ZDUSER": "jarrieta@e-commerce.co",
            "ZDURL": "https://e-commerce.zendesk.com/api/v2",
            "CUSTOM": true
        }
    },
    "icommkt": {
        "e-commerce":{
            "ApiService": "https://ecommerce.icommarketing.com/",
            "ApiKey": "icommkt-api",
            "endpoints":{
                "SaveContact": "Contacts/SaveContact.Json/"
            },
            "ProfileLists":{
                "PROFILE_LIST":"profileID",
            }
        },
    },
    "email":{
        "services":{
            "icommkt":{
                "default":false
            },
            "smtp":{
                "e-commerce": {
                    "username": "noreply@e-commerce.co",
                    "password": "password-here",
                    "host": "your-host",
                    "port": 25,
                    "secure": false
                }
            }
        },
        "default_service": "smtp"
    },
    "vtex":{
        "e-commerce":{
            "ApiService": "http://e-commerce.vtexcommercestable.com.br/api/",
            "x-vtex-api-appKey": "username@e-commerce.com.co",
            "x-vtex-api-appToken": "vtexpassword",
            "endpoints":{
                "listOrders": "oms/pvt/orders"
            },
            "accountName":"e-commerce"

        }
    }
};