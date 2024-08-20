import { Context, Hono, Next } from "hono";

const app = new Hono();
const tracker = async (c: Context, next: Next) => {
	const request = c.req;
	const ip = request.header("CF-Connecting-IP") || request.header("X-Forwarded-For");
	const userAgent = request.header("User-Agent") 
	const referer = request.header("Referer") 
	const userKey = `user:${ip}-${userAgent}-${referer}`;

	await c.env.USER_TRACKING.put(
		userKey,
		JSON.stringify({
			ip,
			userAgent,
			referer,
			time: Date.now(),
		})
	);

	await next();
};
app.use("*", tracker);
app.get("/health", (c) => {

	return c.json({ status: "ok" });
});

export default app;
