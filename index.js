const AWS = require('aws-sdk');
AWS.config.update({ region: "sa-east-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tabela = "cadastros";
 
exports.handler = (event,context,callback) => {
    var user_id = event.body.user_id;
    var item = event.body.item

/*
const item = {
    "user_id": 71,
    "name": "Fulanow"
}
*/
    switch (event.httpMethod) {
        case "POST":
            gravarUsuario(item,callback);
            
             break;
        
        case "GET":
            buscarUsuario(user_id,callback);
            console.log(event.body);

            break;
        
        default:
            callback(null,"Método não suportado");
            
            break;
    
        }
   
};



 var buscarUsuario = function(user_id,callback) {
        let params =  {
            TableName: tabela,
            Key : { 'user_id': user_id, },
        };
         dynamodb.get(params, function (err, data) {
             if (err) {
                 console.log(err);
           } else {
            callback(null,retorno(200, JSON.stringify(data)));
             console.log(user_id);
             //callback(data);
         }
      });
    };
    
 var gravarUsuario = function(item,callback) {
     let params = {
            TableName: tabela,
            Item: item
        };
        dynamodb.put(params, function(err, data) {
            if (err) { 
                callback(null, erro(500, "Erro na gravação do registro", "0003"));
            } else { 
                callback(null, resposta(200, data));
                
            }
        });
 }
    

var resposta = function(_statusCode, _body) {
    let body = {
        ok: true,
        status: _statusCode,
        data: _body
    };
    return retorno(_statusCode, JSON.stringify(body));

};
var erro = function (_statusCode, _mensagem, _codigo, _erro) {
    let body = {
        ok: false,
        status: _statusCode,
        error: {
            mensagem: _mensagem,
            codigo: "Empresas:" + _codigo
        }
    };
    console.log(body);
    if (_erro != undefined) body.error.erro = _erro;
    return retorno(_statusCode, JSON.stringify(body));
};

var retorno = function(_statusCode, _body) {
    return {
        "statusCode": _statusCode,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type,X-Requested-With",
            "Content-Type": "application/json"
        },
        "body": _body,
        "isBase64Encoded": false
    };
};