import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';

const app = new Hono();

// Pretty print JSON for all /api/* routes
app.use('/api/*', prettyJSON({ space: 2 }));

// Enable CORS for all /api/* routes
app.use('/api/*', cors());

app.get('/api', (c) => {
	return c.json({
		'/api': 'List all available API routes',
		'/api/countries': 'List all countries',
		'/api/profile/:id': 'Get a user profile by id',
		'/api/avatar/:id': 'Get a user avatar by id',
	});
});

app.get('/api/countries', async (c) => {
	const { results } = await c.env.DB.prepare('SELECT name, country_code FROM country').all();
	return c.json(results);
});

app
	.get('/api/profile/:id', async (c) => {
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		//>>>>>>>>>>>   Get user profile by id
		const id = c.req.param('id');

		try {
			const { results } = await c.env.DB.prepare('SELECT * FROM profile WHERE id = ?').bind(id).all();
			return c.json(results[0]);
		} catch (e) {
			return c.json({ err: e }, 500);
		}
	})
	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	//>>>>>>>>>>>   Update user profile (Tab: General info)
	.post('/api/profile', async (c) => {
		const body = await c.req.json();

		console.log('\n>>>>>>>>>>in worker', body, '<<<<<<<<<<\n');

		const { user_name, introduction, social_account_urls, country_location_id, mobile, email, user_id } = body;

		try {
			const { success } = await c.env.DB.prepare(
				'UPDATE profile SET user_name = ?1, introduction = ?2, social_account_urls = ?3, country_location_id = ?4, user_id = ?5, mobile = ?6, email = ?7 WHERE id = ?8;'
			)
				.bind(
					user_name,
					introduction,
					JSON.stringify(social_account_urls),
					country_location_id,
					user_id,
					JSON.stringify(mobile),
					JSON.stringify(email),
					1
				)
				.run();

			// const { success } = await c.env.DB.prepare('UPDATE profile SET user_name = ?1, mobile = ?2 WHERE id = ?3;')
			// 	.bind(user_name, JSON.stringify(mobile), 1)
			// 	.run();

			return c.json({
				status: 'success',
				msg: 'User profile updated',
			});
		} catch (e) {
			return c.json({ status: 'error', msg: e }, 500);
		}
	});

app
	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	//>>>>>>>>>>>   Handle user profile image upload
	.post('/api/avatar', async (c) => {
		// parse json body
		const body = await c.req.parseBody();

		// convert file to base64
		const buffer = await body.avatar.arrayBuffer();

		try {
			// insert avatar image and user_id (system level) into db
			// TODO: We hardcode the user_id to 1 for now
			const { success } = await c.env.DB.prepare('INSERT INTO avatar (image, system_user_id) VALUES (?1, ?2)').bind(buffer, 1).run();

			// return avatar id
			return c.text('insertion success');
		} catch (e) {
			return c.json({ err: e }, 500);
		}
	})
	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	//>>>>>>>>>>>   Get avatar image by user id
	.get('/api/avatar/:id', async (c) => {
		const id = c.req.param('id');
		try {
			const { results } = await c.env.DB.prepare('SELECT * FROM avatar WHERE system_user_id = ?').bind(id).all();
			// Use the latest avatar image
			const arrayBuffer = results.pop().image;
			return c.json(arrayBuffer);
		} catch (e) {
			return c.json({ err: e }, 500);
		}
	})
	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	//>>>>>>>>>>>   Get a list of all user ids that have avatars
	.get('/api/avatar', async (c) => {
		try {
			const { results } = await c.env.DB.prepare('SELECT system_user_id, id FROM avatar').all();
			return c.json(results);
		} catch (e) {
			return c.json({ err: e }, 500);
		}
	});

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>   check whether a new user id can be used
app.get('/api/userid/available/:id', async (c) => {
	const id = c.req.param('id');

	if (id.includes('arc')) return c.json({ isAvailable: true });
	else return c.json({ isAvailable: false });
});

app.get('*', (c) => {
	return c.text('Call /api to get a list of available API routes');
});

export default app;
