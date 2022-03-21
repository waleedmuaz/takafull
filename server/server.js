import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import koaBody from 'koa-body';
import GetCRUD from '../server/Crud/Index'

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  webhookHandler: async (topic, shop, body) =>
    delete ACTIVE_SHOPIFY_SHOPS[shop],
});
app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.use(koaBody({ multipart: true }));

  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const responses = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
        });

        if (!responses["APP_UNINSTALLED"].success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${responses.result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };  
  //

  //
  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  //
  router.post( 
    "/api/webhook",
    async (ctx, next) => {
      if(ctx.req.method === "POST"){
        const ifSuccess  = await GetCRUD.post(ctx);
        if(ifSuccess==0){
          ctx.response.status = 200;
          ctx.res.statusCode = 200;
          ctx.body = {
              success: false,
              "Message":"already exist"
          };  
        }else{
          ctx.response.status = 201;
          ctx.body = {
              success: true,
              "Message":"success"
          };
        }
      }else{  
        ctx.response.status = 401;
        ctx.body = {
            success: false,
            "Message":"Unable to save the data."
        };
      }
    }
  );
  router.get( 
    "/api/get/product/takaful",
    async (ctx, next) => {
      if(ctx.req.method === "GET"){
        const productData  = await GetCRUD.getProductData();
          ctx.response.status = 201;
          ctx.body = {
              success: true,
              "Message":"success",
              "data":productData
          };
        }
    }
  ); 
  router.get( 
    "/api/get/plan/takaful",
    async (ctx, next) => {
      if(ctx.req.method === "GET"){
        const planData  = await GetCRUD.getPlanData();
          ctx.response.status = 201;
          ctx.body = {
              success: true,
              "Message":"success",
              "data":planData
          };
        }
    }
  );
  router.get( 
    "/api/get/orders/list",
    async (ctx, next) => {
      if(ctx.req.method === "GET"){
        const orderData  = await GetCRUD.getOrderData();
          ctx.response.status = 201;
          ctx.body = {
              success: true,
              "Message":"success",
              "data":orderData
          };
        }
    }
  );
  
  router.post( 
    "/api/store/product/takaful",
    async (ctx, next) => {
      if(ctx.req.method === "POST"){
        const planData  = await GetCRUD.storeProductForTakaful(ctx); 
          ctx.response.status = 201;
          ctx.body = {
              success: true,
              "Message":"success",
              "data":planData
          };
        }
    }
  );
  router.post( 
    "/apps/api/get/product/takaful/id",
    async (ctx, next) => {
      if(ctx.req.method === "POST"){
        const planData  = await GetCRUD.getProductByIdTakaful(ctx); 
        if(planData){
          let policy =await GetCRUD.getpolicy(ctx);
          ctx.response.status = 201;
          ctx.body = {
              success: true,
              "Message":"success",
              "data":policy
          };
        }else{
          ctx.response.status = 200;
          ctx.body = {
              success: false,
              "Message":"record not found",
          };
        }

        }
    }
  );
  //
  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
