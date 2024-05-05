import { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { loadAuthUser } from '@utils/auth';
import { loadUserPresentations, deletePresentation, createNewPresentation } from '@utils/presentation';
import { Link, useNavigate } from 'react-router-dom';

import LogoutButton from '@profile/logout-button';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [presentations, setPresentations] = useState([]);
    const [selected_uuid, setSelectedUuid] = useState(null);
    const [new_name, setNewName] = useState('');
    const [show_delete, setShowDelete] = useState(false);
    const [show_create, setShowCreate] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Личный кабинет';

        let dataFetch = async () => {
            let auth_user = await loadAuthUser();

            if (auth_user == null)
                navigate('/error', { state: { code: 403, msg: 'У вас нет прав для просмотра данной страницы' } })
            else
                setUser(auth_user);

            let loaded_presentations = await loadUserPresentations();
            setPresentations(loaded_presentations);
        };

        dataFetch().then(r => { });
    }, []);

    let deletePresentationAction = async () => {
        let status = await deletePresentation(selected_uuid);

        if (status) {
            setPresentations(presentations.filter(p => p.uuid !== selected_uuid));
            setSelectedUuid(null);
        }

        setShowDelete(false);
    }

    let deleteHandle = (uuid) => {
        setSelectedUuid(uuid);
        setShowDelete(true);
    }

    let createHandle = () => {
        setShowCreate(true);
    }

    let createPresentationAction = async () => {
        if (new_name < 2)
            return;

        let presentation = await createNewPresentation(new_name);

        if (presentation)
            setPresentations([...presentations, presentation]);

        setNewName('');
        setShowCreate(false);

        window.open(`/editor/${presentation.uuid}`, '_blank', 'noreferrer');
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="user-info">
                            <div>
                                {
                                    user != null ?
                                        <>
                                            <b>{user.fname} {user.lname}</b><br />
                                            <i>{user.email}</i>
                                        </>
                                        :
                                        ''
                                }
                            </div>
                            <LogoutButton></LogoutButton>
                        </div>
                        <h4 className='mt-4'>Список ваших презентаций:</h4>
                        <ul className='pres-list'>
                            {(presentations || []).map((p, i) =>
                                <li key={i}>
                                    <Link target={'_blank'} to={`/editor/${p.uuid}`}>{p.name}</Link>
                                    <button onClick={() => deleteHandle(p.uuid)} className='btn btn-danger'>x</button>
                                </li>
                            )}
                        </ul>
                        <Button onClick={createHandle}>Создать новую презентацию</Button>
                    </div>
                </div>
            </div>

            <Modal show={show_delete} onHide={() => setShowDelete(false)} centered>
                <Modal.Body>Вы уверены, что хотите удалить презентацию?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={deletePresentationAction}>
                        Удалить
                    </Button>
                    <Button variant="primary" onClick={() => setShowDelete(false)}>
                        Отмена
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show_create} onHide={() => setShowCreate(false)} centered>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Новая презентация</Form.Label>
                        <input type="text" className="form-control" value={new_name} onChange={(e) => setNewName(e.target.value)}></input>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={createPresentationAction}>
                        Создать
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}