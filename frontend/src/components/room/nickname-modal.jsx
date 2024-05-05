import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function NicknameModal(props) {
    const [show_modal, setShowModal] = useState(true);

    let saveNicknameHandle = () => {
        if (props.nickname.length >= 1)
        {
            setShowModal(false);
            sessionStorage.setItem('user_nickname', props.nickname);
        }
    }

    let changeNicknameHandle = (value) => {
        if (value.length <= 30)
            props.action('nickname', value);
    }

    let keyDownHandle = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveNicknameHandle();
        }
    }

    useEffect(() => {
        let nickname = sessionStorage.getItem('user_nickname');
        if (nickname != null) {
            props.action('nickname', nickname);
            setShowModal(false);
        }

    }, []);

    return (
        <Modal show={show_modal} centered>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Ваше имя</Form.Label>
                    <input type="text" className="form-control" onChange={(e) => changeNicknameHandle(e.target.value)} onKeyDown={keyDownHandle} value={props.nickname}></input>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={saveNicknameHandle}>
                    Сохранить
                </Button>
            </Modal.Footer>
        </Modal>

    );
}