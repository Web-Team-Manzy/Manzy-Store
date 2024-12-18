import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL } from "../action/accountAction";

const initialState = {
    userInfo: {
        email: "",
        firstName: "",
        lastName: "",
        role: "",
    },
    isLoading: false,
    errorMessage: "",
};

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            console.log(">>> action: ", action);
            return {
                ...state,
            };
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
            };
        case USER_LOGIN_FAIL:
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default accountReducer;
