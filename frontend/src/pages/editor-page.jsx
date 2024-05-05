import React, { useEffect, useReducer, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { loadPresentationForEdit, savePresentation } from '@utils/presentation';

import Header from '@editor/header';
import Section from '@editor/section';
import TopBlock from '@editor/top-block';
import SlidesLeftBlock from '@editor/slides-left-block';

import { SlideEdit } from '@slides/slide';

import editReducer from '@reducers/EditReducer';

import { PresentationContext } from '@contexts/PresentationContext';
import { CurrentSlideNumContext } from '@contexts/CurrentSlideNumContext';
import { EditDispatchContext } from '@contexts/EditDispatchContext';


export default function EditorPage() {
    const { uuid } = useParams();
    const redirect = useNavigate();

    const [presentation, dispatch] = useReducer(editReducer, null);

    const [current_slide, setSlide] = useState(0);
    const [success_save, setSuccessSave] = useState(null);
    const [show_broadcast_msg, setShowBroadcastMsg] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [clicker_token, setClickerToken] = useState('');

    let switchSlide = (i) => {
        if (presentation !== null) {
            if (i >= presentation.slides.length)
                i = 0;
            else if (i === -1)
                i = presentation.slides.length - 1;
            setSlide(i);
        }
    }

    let setSuccessStatus = (status) => {
        setSuccessSave(status);

        if (status) {
            setTimeout(() => {
                setSuccessSave(null);
            }, 3000);
        }
    }

    useEffect(() => {
        let dataFetch = async () => {
            const data = await loadPresentationForEdit(uuid);

            if (data != null) {
                if (data.current_slide < 0) {
                    dispatch({ type: 'load_presentation', presentation: data.presentation });
                    setClickerToken(data.presentation.clicker_token);
                } else {
                    setShowBroadcastMsg(true);
                    setClickerToken(data.presentation.clicker_token);
                }
            } else
                redirect('/error', { state: { code: 404, msg: 'Презентация не найдена' } });
        };

        dataFetch().then(r => { });
    }, [uuid]);

    useEffect(() => {
        document.title = 'Редактор презентаций';
    }, [])

    useEffect(() => {
        const interval = setInterval(async () => {
            let status = await savePresentation(uuid, presentation);
            setSuccessStatus(status);
        }, 60000);

        return () => clearInterval(interval);
    });

    useEffect(() => {
        let handleKeyDown = async (e) => {
            const code = e.which || e.keyCode;

            let char_code = String.fromCharCode(code).toLowerCase();

            if ((e.ctrlKey || e.metaKey) && char_code === 's') {
                e.preventDefault();
                let status = await savePresentation(uuid, presentation);
                setSuccessStatus(status);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [presentation]);

    // useEffect(() => {
    //     console.log(presentation);
    // }, [presentation]);

    useEffect(() => {
        let save = async () => {
            let status = await savePresentation(uuid, presentation);
            setSuccessStatus(status);
        }

        if (presentation != null)
            save();

    }, [presentation?.slides.length]);


    return (<>

        <Header success={success_save} uuid={uuid} clicker_token={clicker_token}></Header>

        <Section>
            {presentation !== null ?
                <>
                    <EditDispatchContext.Provider value={dispatch}>
                        <TopBlock switchAction={switchSlide} name={presentation !== null ? presentation.name : ''} setSpinner={setSpinner}></TopBlock>
                    </EditDispatchContext.Provider>

                    <CurrentSlideNumContext.Provider value={current_slide}>
                        <PresentationContext.Provider value={presentation}>
                            <EditDispatchContext.Provider value={dispatch}>

                                <SlidesLeftBlock switchAction={switchSlide} />

                            </EditDispatchContext.Provider>
                        </PresentationContext.Provider>
                    </CurrentSlideNumContext.Provider>

                    <CurrentSlideNumContext.Provider value={current_slide}>
                        <EditDispatchContext.Provider value={dispatch}>

                            {spinner ? <Spinner animation="border" />
                                : <SlideEdit key={current_slide} {...presentation.slides[current_slide]} />
                            }

                        </EditDispatchContext.Provider>
                    </CurrentSlideNumContext.Provider>

                </> : ''}
        </Section>

        <Modal show={show_broadcast_msg} centered>
            <Modal.Body>
                Редактирование невозможно, идет трансляция.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => setShowBroadcastMsg(false)}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    </>);
}