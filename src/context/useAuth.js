import { useContext } from 'react';
import AuthContext from './AuthContext';

/* Allows components to access authentication information */
export function useAuth() {
    return useContext(AuthContext);
}