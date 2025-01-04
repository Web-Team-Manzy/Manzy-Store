import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT_REQUEST,
    USER_LOGOUT_SUCCESS,
    USER_LOGOUT_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    GET_ACCOUNT_BALANCE_REQUEST,
    GET_ACCOUNT_BALANCE_SUCCESS,
    GET_ACCOUNT_BALANCE_FAIL,
} from "../action/accountAction";

const initialState = {
    userInfo: {
        id: "",
        email: "",
        firstName: "",
        lastName: "",
        displayName: "",
        role: "",
        address: "",
        balance: 0,
    },
    accessToken: "",
    refreshToken: "",
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
                accessToken: action.accessToken,
                refreshToken: action.refreshToken,
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
        case USER_LOGOUT_REQUEST:
            console.log(">>> action: ", action);
            return {
                ...state,
                isLoading: true,
                errorMessage: "",
                isDoLogin: false,
            };
        case USER_LOGOUT_SUCCESS:
            console.log(">>> action: ", action);
            return {
                ...state,
                userInfo: {
                    email: "",
                    firstName: "",
                    lastName: "",
                    role: "",
                },
                accessToken: "",
                refreshToken: "",
                isLoading: false,
                isDoLogin: false,
                errorMessage: "",
            };
        case USER_LOGOUT_FAIL:
            console.log(">>> action: ", action);
            return {
                ...state,
                isLoading: false,
                errorMessage: action.error,
                isDoLogin: false,
            };
        case USER_UPDATE_REQUEST:
            return {
                ...state,
                isLoading: true,
                errorMessage: "",
            };
        case USER_UPDATE_SUCCESS:
            return {
                ...state,
                userInfo: action.user, // Cập nhật userInfo với dữ liệu mới
                isLoading: false,
                errorMessage: "",
            };
        case USER_UPDATE_FAIL:
            return {
                ...state,
                isLoading: false,
                errorMessage: action.error, // Lưu thông báo lỗi
            };

        case GET_ACCOUNT_BALANCE_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_ACCOUNT_BALANCE_SUCCESS:
            return {
                ...state,
                balance: action.balance,
                loading: false,
            };
        case GET_ACCOUNT_BALANCE_FAIL:
            return {
                ...state,
                error: action.error,
                loading: false,
            };
        default:
            return state;
    }
};

export default accountReducer;
