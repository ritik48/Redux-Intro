import { createStore, combineReducers } from "redux";

const initialStateAccount = {
    balance: 0,
    loan: 0,
    purpose: "",
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
        default:
            return state;
    }
}

// action creator
export function deposit(amount) {
    return { type: "account/deposit", payload: amount };
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

const store = createStore(rootReducer);
export default store;
