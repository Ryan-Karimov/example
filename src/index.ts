import http from 'http';

import app from './app'
import { APP } from './config';

const server = http.createServer(app);

server.listen(APP.PORT, APP.HOST, () => {
    console.log('___________________________________________');
    console.log(`Server is running on http://${APP.HOST}:${APP.PORT}`);
    console.log('___________________________________________');
});
