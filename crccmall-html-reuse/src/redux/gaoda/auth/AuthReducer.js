import * as type from './AuthType';

const initialState = {
    isLogin:true,
    userInfo: {
        menu:[]
    }
}
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case type.RECEIVE_DATA:
            return {...state, userInfo: action.data};
        default:
            return state;
    }
};

export {
    authReducer
}