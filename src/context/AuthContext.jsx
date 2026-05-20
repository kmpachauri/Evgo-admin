import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLogged, setIsLogged] = useState(false);
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null)
    const [adminAsUser, setAdminAsUser] = useState(null)

    useEffect(() => {
        const storedToken = localStorage.getItem("secureKeytoken");
        const storedUser = localStorage.getItem("secureKeyuser");
        const storedLoggedIn = localStorage.getItem("SecureKeyLogged");
        const AccessRole = localStorage.getItem("AccessRole");
        const _adminAsUser = localStorage.getItem("adminAsUser");

        if (storedToken && storedUser && storedLoggedIn === "true") {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsLogged(true);
            setUserRole(AccessRole)
        }
        if (_adminAsUser) {
            setAdminAsUser(JSON.parse(_adminAsUser))
        }

        setLoading(false); // Mark as done loading after checking storage
    }, []);

    const login = (token, user) => {
        setUser(user);
        setIsLogged(true);
        setToken(token);
        setUserRole(user?.role)
        localStorage.setItem('secureKeytoken', token);
        localStorage.setItem('SecureKeyLogged', true);
        localStorage.setItem('secureKeyuser', JSON.stringify(user));
        localStorage.setItem('AccessRole', user?.role);
        if (user.role === 'user') {
            navigate('/user/dashboard', { replace: true })
        } else {
            navigate('/dashboard', { replace: true })
        }
    }
    const logout = () => {
        console.log(adminAsUser)
        if (adminAsUser) {
            setAdminAsUser(null)
            setUser(adminAsUser.user)
            setIsLogged(true);
            setToken(adminAsUser.token);
            setUserRole('admin')
            login(adminAsUser.token, adminAsUser.user)
            localStorage.removeItem('adminAsUser');
            navigate('/dashboard')
            return
        } else {
            setUser(null);
            setIsLogged(false);
            setToken(null);
            setUserRole(null)
            localStorage.removeItem('secureKeytoken');
            localStorage.removeItem('SecureKeyLogged');
            localStorage.removeItem('secureKeyuser');
            localStorage.removeItem('AccessRole');
            localStorage.removeItem('lastPath');
            window.location.replace('/login');
        }

    }
    const loginAsAdmin = (_token, _user) => {

    //     console.log({
    //         oldToken:token,
    //         newToken:_token,
    //         oldUser:user,
    //         newUser:_user
    //     })
    //    return
        let _adminData = {
            token: token,
            user: user,
            isLoggedIn: true
        }

        localStorage.setItem('adminAsUser', JSON.stringify(_adminData));
        setAdminAsUser(_adminData)
        login(_token, _user)
    }




    return (
        <authContext.Provider value={{
            user,
            setUser,
            loading,
            setLoading,
            isLogged,
            setIsLogged,
            token,
            setToken,
            error,
            setError,
            login,
            logout,
            userRole, setUserRole, loginAsAdmin, adminAsUser
        }}>
            {children}
        </authContext.Provider>
    );
}


export default authContext;
