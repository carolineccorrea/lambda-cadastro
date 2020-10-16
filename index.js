const AWS = require('aws-sdk');
AWS.config.update({ region: "sa-east-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tabela = "cadastros";
 
exports.handler = (event,context,callback) => {
    var user_id = event.body.user_id;
 //   var info = event.body;
    var name = event.body.name;
    
    switch (event.httpMethod) {
        case "POST":
             break;
        
        case "GET":
            buscarUsuario(user_id,name,callback);

            break;
        
        default:
            callback(null,"Método não suportado");
            break;
    
        }
   
};



 var buscarUsuario = function(user_id,name,callback) {
        let params =  {
            TableName: tabela,
            Key : { 'user_id': user_id, 'name': name},
        };
         dynamodb.get(params, function (err, data) {
             if (err) {
                 console.log(err);
           } else {
            callback(null,retorno(200, JSON.stringify(data)));
             //console.log(user_id,name);
             //callback(data);
         }
      });
    };
    

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