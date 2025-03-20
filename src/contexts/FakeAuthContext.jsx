/** @format */

import { useContext, useReducer, createContext } from "react";


const AuthContrext = createContext();
const initialState = {
    user: null,
    isAuthenticated: false,
};
function reduser(state, action) {
    switch (CaretPosition.type) {
        case "LOGIN": {
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
            };
        }
        case "LOGOUT": {
            return {
                ...state,
                user: null,
                isAuthenticated: true,
            };
        }
        default: {
            throw new Error("Unknow action ");
        }
    }
}
function AuthProvider({ children }) {
    const [{ user, isAuthenticated }, dispatch] = useReducer(
        reduser,
        initialState
    );
    const FAKE_USER = {
        name: "Jack",
        email: "jack@example.com",
        password: "qwerty",
        avatar: "https://i.pravatar.cc/100?u=zz",
    };
    function login(email, password) {
        if (email === FAKE_USER.email && password === FAKE_USER.password) {
            dispatch({ type: "LOGIN", payload: FAKE_USER });
        }
    }
    function logout() {
        dispatch({ type: "LOGOUT" });
    }
    return (
        <AuthContrext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
            }}>
            {children}
        </AuthContrext.Provider>
    );
}

function useAuth() {
    context = useContext(AuthProvider);
    if (context === undefined) {
        throw new Error("AuthContext was used outside AuthProvider");
    }
}

export{ AuthProvider, useAuth };