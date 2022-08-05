import React, { Component } from 'react';

const { Provider, Consumer } = React.createContext();

import NoAccess from '../components/Pages/NoAccess/NoAccessComponent';
import Loading  from '../components/Pages/Loading/LoadingComponent';

export function isSatisfied(requirements, userRights) {
    return requirements.map(r => {
        return userRights.find(us => us.machine_name === r) !== undefined;
    }).filter(o => !o).length === 0;
}
  
export function protect(requirements, WrappedComponent, user) {
    return !!user && !user.isFetching
        ? user.user && user.user.rights && user.user.rights.length > 0 && isSatisfied(requirements, user.user.rights)
            ? (WrappedComponent)
            : (NoAccess)
        : (Loading);
}

export function protectOnlyLogging(WrappedComponent, user) {
    return  !!user && !user.isFetching
        ? user.loggingIn
            ? (WrappedComponent)
            : (NoAccess) 
        : (Loading);
}