import app from './app';
import config from './config';

import { initializeScheduler } from './app/utils/scheduler';

async function main() {
    try {
        // Start Scheduler
        initializeScheduler();

        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    } catch (err) {
        console.log(err);
    }
}

main();
