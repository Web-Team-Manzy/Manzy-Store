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
                isLoading: true,
                errorMessage: "",
            };
        case USER_LOGIN_SUCCESS:
            console.log(">>> action: ", action);
            return {
                ...state,
                userInfo: action.user,
                isLoading: false,
                errorMessage: "",
            };
        case USER_LOGIN_FAIL:
            console.log(">>> action: ", action);
            return {
                ...state,
                isLoading: false,
                errorMessage: action.error,
            };
        default:
            return state;
    }
};

export default accountReducer;
