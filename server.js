import { handler } from './build/handler.js';
import express from 'express';

const app = express();
const PORT = 3300;

app.get('/handle-check', (req, res) => {
	console.log('handle check ok!');
});

/**
 * -- let SvelteKit handle everything else, including serving prerendered pages and static assets
 */
app.use(handler);

app.listen(PORT, () => {
	console.log('Start server listening on port 3300.');
});
