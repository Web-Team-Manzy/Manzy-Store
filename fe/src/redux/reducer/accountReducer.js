import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL } from "../action/accountAction";

const initialState = {
    userInfo: {
        email: "",
        firstName: "",
        lastName: "",
        role: "",
    },
    isLoading: false,
    isDoLogin: false,
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
                isDoLogin: action.isDoLogin || false,
            };
        case USER_LOGIN_SUCCESS:
            console.log(">>> action: ", action);
            return {
                ...state,
                userInfo: action.user,
                isLoading: false,
                errorMessage: "",
                isDoLogin: action.isDoLogin || false,
            };
        case USER_LOGIN_FAIL:
            console.log(">>> action: ", action);
            return {
                ...state,
                isLoading: false,
                errorMessage: action.error,
                isDoLogin: action.isDoLogin || false,
            };
        default:
            return state;
    }
};

export default accountReducer;
