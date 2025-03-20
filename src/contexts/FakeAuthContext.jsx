/** @format */

import { useContext, useReducer, createContext } from "react";


const AuthContext = createContext();
const initialState = {
    user: null,
    isAuthenticated: false,
};
function reduser(state, action) {
    switch (action.type) {
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
                isAuthenticated: false,
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
        name: "Hazem",
        email: "Hazem@example.com",
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
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
            }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("AuthContext was used outside AuthProvider");
    }
    return context;
}

export { AuthProvider, useAuth };