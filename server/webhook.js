const crypto = require('crypto') // Built-in module of Node.js
const Router = require('koa-router')

const router = new Router({ prefix: '/webhooks' })

// Middleware to verify all webhooks call from Shopify
async function verifyShopifyWebhooks(ctx, next) {
	const topic = ctx.request.headers['x-shopify-topic']
	const shop = ctx.request.headers['x-shopify-shop-domain']
	const hmac = ctx.request.headers['x-shopify-hmac-sha256']

	if (!hmac || !shop || !topic) {
		return ctx.throw(401, "Webhook must originate from Shopify!")
	}

	const genHash = crypto
		.createHmac('sha256', process.env.SHOPIFY_API_SECRET)
		.update(JSON.stringify(ctx.request.body))
		.digest('base64')

	if (genHash !== hmac) {
		ctx.throw(401, "Couldn't verify incomming Webhook request!")
	}

	await next()
}

router.use(verifyShopifyWebhooks)

// Here go all your webhooks API handlers 

router.post("/webhooked", async (ctx) => {
    console.log(ctx)
	ctx.status = 200
	ctx.body = "Webhook processed!"
})

module.exports = router