import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { loadUsersList, deleteUser, createNewUser } from '@utils/users';

import LogoutButton from '@profile/logout-button';


export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [selected_id, setSelectedId] = useState(null);
    const [show_delete, setShowDelete] = useState(false);
    const [show_create, setShowCreate] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Управление пользователями';

        let dataFetch = async () => {
            let users_list = await loadUsersList();

            if (users_list == null)
                navigate('/error', { state: { code: 403, msg: 'У вас нет прав для просмотра данной страницы' } })
            else
                setUsers(users_list);
        };

        dataFetch().then(r => { });
    }, []);

    let deleteUserAction = async () => {
        let status = await deleteUser(selected_id);

        if (status) {
            setUsers(users.filter(u => u.id !== selected_id));
            setSelectedId(null);
        }

        setShowDelete(false);
    }

    let deleteHandle = (id) => {
        setSelectedId(id);
        setShowDelete(true);
    }

    let createHandle = () => {
        setShowCreate(true);
    }

    let createUserAction = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);

        let user = await createNewUser(form);

        if (user)
            setUsers([...users, user]);

        setShowCreate(false);
    }

    return (
        <>

            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="user-info">
                            <LogoutButton></LogoutButton>
                        </div>
                        <h4 className='mt-4'>Список пользователей:</h4>
                        <ul className='pres-list'>
                            {(users || []).map((u, i) =>
                                <li key={i}>
                                    Имя: <b>{u.fname} {u.lname}</b> <br/> 
                                    Почта: <b>{u.email}</b>
                                    <button onClick={() => deleteHandle(u.id)} className='btn btn-danger'>x</button>
                                </li>
                            )}
                        </ul>
                        <Button onClick={createHandle}>Создать пользователя</Button>
                    </div>
                </div>
            </div>


            <Modal show={show_delete} onHide={() => setShowDelete(false)} centered>
                <Modal.Body>Вы уверены, что хотите удалить пользователя?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={deleteUserAction}>
                        Удалить
                    </Button>
                    <Button variant="primary" onClick={() => setShowDelete(false)}>
                        Отмена
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show_create} onHide={() => setShowCreate(false)} centered>
                <Modal.Body>
                    <Form onSubmit={createUserAction}>
                        <Form.Group className="mb-3">
                            <Form.Label>Имя</Form.Label>
                            <input type="text" className="form-control" name="fname" required></input>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Фамилия</Form.Label>
                            <input type="text" className="form-control" name="lname" required></input>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <input type="text" className="form-control" name="email" required></input>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <input type="text" className="form-control" name="password" required></input>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Button variant="primary" type="submit">
                                Создать
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}