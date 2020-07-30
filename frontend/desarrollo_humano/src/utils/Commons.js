// return the user data from the session storage
export const getUser = () => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    else return null;
}

// return the token from the session storage
export const getToken = () => {
    return sessionStorage.getItem('token') || null;
}

// return the userid from the session storage
export const getUserId = () => {
    return sessionStorage.getItem('userid') || null;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
}

// set the token and user from the session storage
export const setUserSession = (token, user, userid, pages) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userid', userid);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('pages', JSON.stringify(pages));
}

//Autenticación y Autorización
export const setAllowed = (rights) => {
    sessionStorage.setItem('pages', rights);
}

export const getAllowed = () => {
    return JSON.parse(sessionStorage.getItem('pages')) || [];
}

export const isAllowed = (path) => {
    const route = getAllowed();
    if (path !== "/desarrollo_humano") {
        route.flat(2).find( elem => elem.pagina === path );
    }
    
    return getToken() && route !== [];
}


/*export const isAllowed = (user, rights) =>
  rights.some(right => user.rights.includes(right));

export const hasRole = (user, roles) =>
  roles.some(role => user.roles.includes(role));*/