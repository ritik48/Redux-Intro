import { useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import store from "./store";

import { withdraw, deposit, applyLoan, payLoan, createUser } from "./store";

function User() {
    const [user, setUser] = useState("");
    const [userId, setUserId] = useState("");

    const dispatch = useDispatch();

    function handleCreateUser() {
        if (!user || !userId) return;
        dispatch(createUser(user, userId));
    }

    return (
        <div className="container">
            <div className="row">
                <label for="user">Username</label>
                <input
                    id="user"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
            </div>
            <div className="row">
                <label for="userId">User Id</label>
                <input
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
            </div>
            <button className="btn" onClick={handleCreateUser}>
                Create
            </button>
        </div>
    );
}

function Account() {
    const [currency, setCurrency] = useState("USD");
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [loanAmount, setLoanAmount] = useState("");
    const [loanPurpose, setLoanPurpose] = useState("");

    const dispatch = useDispatch();

    const { loan, purpose } = useSelector((store) => store.account);

    function handleDeposit() {
        if (!depositAmount) return;
        dispatch(deposit(depositAmount));
    }

    function handleWithdraw() {
        if (!withdrawAmount) return;
        dispatch(withdraw(withdrawAmount));
    }

    function handleRequestLoan() {
        if (!loanAmount || !loanPurpose) return;
        dispatch(applyLoan(loanAmount, loanPurpose));
    }

    function handlePayLoan() {
        dispatch(payLoan());
    }

    return (
        <div className="container">
            <div className="row">
                <label for="deposit">Deposit</label>
                <input
                    id="deposit"
                    value={depositAmount}
                    onChange={(e) =>
                        setDepositAmount(
                            isNaN(parseInt(e.target.value))
                                ? ""
                                : parseInt(e.target.value)
                        )
                    }
                />
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    <option value="USD">US Dollar</option>
                    <option value="EUR">Euro</option>
                    <option value="GBP">British Pound</option>
                </select>
                <button onClick={handleDeposit}>Deposit</button>
            </div>
            <div className="row">
                <label for="withdraw">Withdraw</label>
                <input
                    id="withdraw"
                    value={withdrawAmount}
                    onChange={(e) =>
                        setWithdrawAmount(
                            isNaN(parseInt(e.target.value))
                                ? ""
                                : parseInt(e.target.value)
                        )
                    }
                />
                <button onClick={handleWithdraw}>Withdraw</button>
            </div>
            <div className="row">
                <label for="loan">Request Loan</label>
                <input
                    id="loan"
                    value={loanAmount}
                    onChange={(e) =>
                        setLoanAmount(
                            isNaN(parseInt(e.target.value))
                                ? ""
                                : parseInt(e.target.value)
                        )
                    }
                />
                <input
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                />
                <button onClick={handleRequestLoan}>Request Loan</button>
            </div>
            {loan > 0 && (
                <>
                    <p>
                        💵You have a loan of {loan} taken for 💼 {purpose}
                    </p>
                    <button className="btn" onClick={handlePayLoan}>
                        Pay Loan
                    </button>
                </>
            )}
        </div>
    );
}

function Balance() {
    const { balance } = useSelector((store) => store.account);
    return (
        <div className="container">
            <div className="balance">${balance.toFixed(2)}</div>
        </div>
    );
}

function Header({ user }) {
    return (
        <div className="row">
            <h3>Welcome 🤝 {user}</h3>;
            <Balance />
        </div>
    );
}

function App() {
    const { name: user } = useSelector((store) => store.user);
    return (
        <div className="App">
            <h1>Redux intro</h1>

            {!user && <User />}
            {user && (
                <>
                    <Header user={user} />
                    <Account />
                </>
            )}
        </div>
    );
}

export default App;
