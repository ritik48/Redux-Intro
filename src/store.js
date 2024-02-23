import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";

const initialStateAccount = {
    balance: 0,
    loan: 0,
    purpose: "",
    isLoading: false,
};

function accountReducer(state = initialStateAccount, action) {
    switch (action.type) {
        case "account/withdraw":
            if (action.payload > state.balance) return state;
            return {
                ...state,
                balance: state.balance - action.payload,
            };
        case "account/deposit":
            return {
                ...state,
                balance: state.balance + action.payload,
                isLoading: false,
            };
        case "account/applyLoan":
            if (state.loan > 0) return state;
            return {
                ...state,
                balance: state.balance + action.payload.amount,
                purpose: action.payload.purpose,
                loan: action.payload.amount,
            };
        case "account/payLoan":
            return {
                ...state,
                balance: state.balance - state.loan,
                loan: 0,
                purpose: "",
            };
        case "account/convertingToCurrency":
            return {
                ...state,
                isLoading: true,
            };
        default:
            return state;
    }
}

// action creator
export function deposit(amount, currency) {
    if (currency === "USD") {
        return { type: "account/deposit", payload: amount };
    }

    // middleware: to perform api calls before dispatching action to redux store
    return async function (dispatch, getState) {
        dispatch({ type: "account/convertingToCurrency" });

        const host = "api.frankfurter.app";
        const res = await fetch(
            `https://${host}/latest?amount=${amount}&from=${currency}&to=USD`
        );
        const data = await res.json();

        dispatch({ type: "account/deposit", payload: data.rates.USD });
    };
}

export function withdraw(amount) {
    return { type: "account/withdraw", payload: amount };
}

export function applyLoan(amount, purpose) {
    return { type: "account/applyLoan", payload: { amount, purpose } };
}

export function payLoan() {
    return { type: "account/payLoan" };
}

// ============================= User reducer ==================

const initialStateUser = {
    name: "",
    userId: "",
    createdAt: "",
};

function userReducer(state = initialStateUser, action) {
    switch (action.type) {
        case "user/createUser":
            return {
                ...state,
                name: action.payload.name,
                createdAt: action.payload.createdAt,
                userId: action.payload.userId,
            };
        case "user/updateName": {
            return {
                ...state,
                name: action.payload,
            };
        }
        default:
            return state;
    }
}

export function createUser(name, userId) {
    return {
        type: "user/createUser",
        payload: { name, userId, createdAt: new Date().toISOString() },
    };
}

export function updateName(name) {
    return { type: "user/updateName", payload: name };
}

const rootReducer = combineReducers({
    account: accountReducer,
    user: userReducer,
});

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);
export default store;
