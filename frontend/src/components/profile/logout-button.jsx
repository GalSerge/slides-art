import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import {clearAuthToken} from '@utils/auth';


export default function LogoutButton() {
    const redirect = useNavigate();

    let logoutHandle = () => {
        clearAuthToken();
        redirect('/login');
    }


    return (
        <Button className="btn btn-danger" onClick={logoutHandle}>Выйти</Button> 
    );
}