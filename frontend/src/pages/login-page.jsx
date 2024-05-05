import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { API_SERVER } from '@constants';

import { fetchToken, setToken, setAuthUser } from '@utils/auth';


export default function LoginPage(props) {
    const [msg, setMsg] = useState(null);

    const redirect = useNavigate();

    let handleSubmit = async (e) => {
        e.preventDefault();
        let form = new FormData(e.target);

        const response = await fetch(`${API_SERVER}/login`,
            {
                method: 'POST',
                body: form,
            });

        if (response.ok) {
            let result = await response.json();
            setToken(result.access_token, result.token_type);
            await setAuthUser();

            if (props.hasOwnProperty('pathname'))
                redirect(props.pathname);
            else
                redirect('/profile');
        } else if (response.status === 401) {
            setMsg('Неверный логин или пароль');
        } else {
            setMsg('Произошла ошибка, поторите попытку позже');
        }
    };

    useEffect(() => {
        document.title = 'Войти на сайт';

        let token = fetchToken();

        if (token != null)
            redirect('/profile');
    }, []);

    return (
        <>
            <div className="container">
                <div className="row vh-100">
                    <div className="col-12 align-self-center">
                        <div className="auth-page">
                            <h3>Вход на сайт</h3>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="username" />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control type="password" name="password" />
                                </Form.Group>
                                {msg != null ?
                                    <p>{msg}</p>
                                    : ''
                                }
                                <Button variant="primary" type="submit">
                                    Войти
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}