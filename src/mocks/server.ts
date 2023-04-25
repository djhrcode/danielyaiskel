import { setupServer } from 'msw/node'
import { handlers } from './handlers';



export function bootServerMocks() {

    if (global.window !== undefined) 
        throw new RangeError("Cannot load Node.js server in client execution");

    return setupServer(...handlers);
}