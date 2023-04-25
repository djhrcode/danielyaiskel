import { setupWorker } from 'msw'
import { handlers } from './handlers';

export function bootClientMocks() {

    if (global.window === undefined) 
        throw new RangeError("Cannot load Client server in Node.js execution");

    return setupWorker(...handlers);
}