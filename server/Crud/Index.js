const { OrderWebhookCallBack, findAndCreate,getProductTakafulData ,getPlanTakafulData , storeProduct,getProductByIdTakafulMysql,GetPolicyMySQL,getOrderDataMySQL,updateOrderwithPolicy} = require("../mysqlidb");


async function post(ctx) {
  const data = ctx.request.body;
  const IfOrderExsit = await findAndCreate(data.id);
  if(IfOrderExsit==1){
    console.log('already exist')
    return 0;
  }
   OrderWebhookCallBack(data);
  let fetData =await fetch('https://retail.jubileegeneral.com.pk/JubileeWebApp/sales/submitPurchaseProtectionPolicy', {
  method: 'POST',
  mode: 'cors',
  headers:{
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa(`HEFMZYAGQJ29JC35YQ6FY41OFZON03MT:7MBZTO0D44`),
  },
    body: JSON.stringify({
      "orderid": data.id,
      "order_total": "1111",
      "customer_detail": {
          "customer_email": data.customer.email,
          "customer_mobile": data.shipping_address.phone,
          "customer_dob": "0000-00-00",
          "customer_cnic": "3520213978175",
          "customer_firstname": data.customer.first_name,
          "customer_lastname": data.customer.last_name,
          "customer_address": data.billing_address.address1+" "+data.billing_address.city+" "+data.billing_address.province+" "+data.billing_address.country+" "+data.billing_address.zip,
          "customer_city": data.billing_address.city
      },
      "items": [
          {
              "item_premium": "200",
              "duration": 3,
              "durationType": "month",
              "item_name": "T500 Smart Watch For Android & IOS",
              "item_qty": 1,
              "item_price": "2199",
              "IMEI": "",
              "seriral_number": "98079",
              "retailer_sku": "TM-sku",
              "sum_insured": "2199",
              "isTakaful": 1,
              "filer_tax_status": "Filer",
              "filer_tax_total": 1
          }
      ]
    })
  })
  let policy =await fetData.json();
  updateOrderwithPolicy(data,policy)
  return 1;
}
async function storeProductForTakaful(ctx){
  return await storeProduct(ctx);
}
async function getProductData() {
    return await getProductTakafulData();
}
async function getPlanData() {
  return await getPlanTakafulData();
}
async function getProductByIdTakaful(ctx){
  return await getProductByIdTakafulMysql(ctx);
}
async function getpolicy(ctx){
  return await GetPolicyMySQL(ctx);
}

async function getOrderData(ctx){
  return await getOrderDataMySQL(ctx);
}

const postRequest = { post , getProductData,getPlanData,storeProductForTakaful,getProductByIdTakaful,getpolicy,getOrderData};
export default postRequest; 