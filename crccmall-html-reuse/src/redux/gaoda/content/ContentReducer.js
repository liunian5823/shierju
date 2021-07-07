/**
 * Created by zhouby on 2018/5/27/027.
 */

const contentReducer = (state = {showContent:false,contentTitle:""}, action) => {
    switch (action.type) {
        case "SHOW_CONTENT":
            return {...state, ...action.item};
        case "HIDE_CONTENT":
            return {...state, ...action.item};

        default:
            return state;
    }
};

export {
    contentReducer
}

