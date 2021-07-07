import * as type from './AuthType';

export const receiveUser = (data) => {
    return {
        type: type.RECEIVE_DATA,
        data
    }
};
