import { corsError } from 'errors';

// your frontend application should be included here
const whiteList = ['http://127.0.0.1:5500', 'https://www.examplesite.com', 'http://localhost:3000'];
export const corsOption = {
    origin: (origin, callback) => {
        // remove the !origin after development
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new corsError("CORS error"));
        }
    },
    optionsSuccessStatus: 200
};
