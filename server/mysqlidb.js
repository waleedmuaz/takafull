const mysql = require("mysql");
import {parseGid} from '@shopify/admin-graphql-api-utilities';

const connection = mysql.createConnection({
    host: 'http://143.110.177.123/',
    user: 'onlinesupplies',
    password: 'Cruxosoft@123',
    database: 'tak'
});

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
   
    console.log('Connected to the MySQL server.');
  });

let domain = '';

async function OrderWebhookCallBack(order) {  
    try {
            let query = new Promise((resolve, reject) => {
                connection.query(`INSERT INTO orders (order_id,json_order) VALUES ('${order.id}' , '${JSON.stringify(order)}')`),function(error, results, fields) {
                    if(error) throw error;
                }
            });

            await query;
            return true;
            
        } catch(err) {
            return false;
        }
}
async function updateOrderwithPolicy(order,policy) {
        try {
            connection.query(`UPDATE orders set policy_id='${policy.policyid}' where order_id='${order.id}'`,
                function(error, results, fields) {
    
                });
            return true;
        } catch(err) {
            if(err) throw err;
        }
    
    }
async function findAndCreate(id){
    let orderData ={};
        try {
            let query = new Promise((resolve, reject) => {
                connection.query(`SELECT * FROM orders WHERE order_id='${id}' limit 1`,
                    function(error, results, fields) {
                        orderData=results[0];
                        resolve();
                    });
            });
            await query;
            if ( typeof orderData !== 'undefined' && orderData ){
                return 1;
            }else{
                return 0;
            }
        } catch(err) {
            return err;
        }
}
async function getProductTakafulData() {
        let ProductData ={};
        try {
            let query = new Promise((resolve, reject) => {
                connection.query(`SELECT * FROM products_takaful_pivot`,
                    function(error, results, fields) {
                        ProductData=results;
                        resolve();
                    });
            });
            await query;
            return ProductData;
        } catch(err) {
            console.log(err);
        }
        return ProductData;
}
async function getPlanTakafulData() {
        let PlansData ={};
        try {
            let query = new Promise((resolve, reject) => {
                connection.query(`SELECT * FROM bundles`,
                    function(error, results, fields) {
                        PlansData=results;
                        resolve();
                    });
            });
            await query;
            return PlansData;
        } catch(err) {
            console.log(err);
        }
        return PlansData;
}
async function storeProduct(ctx){
    let data = ctx.request.body;

    connection.query(`TRUNCATE TABLE  products_takaful_pivot`);


    data.selection.forEach(element => {
    try {
        connection.query(`INSERT INTO products_takaful_pivot 
            (product_id, product_json, status) VALUES 
            ('${parseGid(element.id)}','${JSON.stringify(element)}','1')`,
        function(error, results, fields) {
            if(error) throw error;
        });
            return true;
        } catch(err) {
            if(err) throw err;
        }
    });


}

async function getProductByIdTakafulMysql(ctx){
    let data = ctx.request.body;
    let productAddedData ={};
    try {
        let query = new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM products_takaful_pivot where product_id = `+data.product_id,
                function(error, results, fields) {
                    productAddedData=results[0];
                    resolve();
                });
        });
        await query;
        return productAddedData;
    } catch(err) {
        console.log(err);
    }
    return productAddedData;

}
async function GetPolicyMySQL(ctx){
    let data = ctx.request.body;
    let policyData ={};
    try {
        let query = new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM bundles where start_rate <=`+data.price+` and end_rate >=`+data.price,
                function(error, results, fields) {
                    policyData=results;
                    resolve();
                });
        });
        await query;
        console.log(policyData);
        return policyData;
    } catch(err) {
        console.log(err);
    }
    return policyData;

}
async function getOrderDataMySQL(){
    let orderData ={};
    try {
        let query = new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM orders`,
                function(error, results, fields) {
                    orderData=results;
                    resolve();
                });
        });
        await query;
        return orderData;
    } catch(err) {
        console.log(err);
    }
    return orderData;
}

module.exports = {
    findAndCreate,
    OrderWebhookCallBack,
    getProductTakafulData,
    getPlanTakafulData,
    storeProduct,
    getProductByIdTakafulMysql,
    GetPolicyMySQL,
    getOrderDataMySQL,
    updateOrderwithPolicy
}