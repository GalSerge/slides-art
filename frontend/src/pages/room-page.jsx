import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ReadyState } from 'react-use-websocket';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import { loadPresentation } from '@utils/presentation';
import { loadCurrentSlideData, getTargetSlideNum, startBroadcast, stopBroadcast, sendSlideImage, exportPdf } from '@utils/broadcast';
import { fetchToken, getAuthUser } from '@utils/auth';

import { SlideView } from '@slides/slide';

import NicknameModal from '@room/nickname-modal';

import { PresentationContext } from '@contexts/PresentationContext';
import { CurrentSlideNumContext } from '@contexts/CurrentSlideNumContext';
import { BroadcastDispatchContext } from '@contexts/BroadcastDispatchContext';
import { UserContext } from '@contexts/UserContext';
import { WebSocketContext } from '@contexts/WebSocketContext';
import { FullscreenContext } from '@contexts/FullscreenContext';

import broadcastReducer from '@reducers/BroadcastReducer';


import { toBlob } from 'html-to-image';


export default function RoomPage() {
    const { uuid } = useParams();
    const redirect = useNavigate();
    const [search_params] = useSearchParams();

    const [presentation, dispatch] = useReducer(broadcastReducer, null);

    const [send, msg, ready] = useContext(WebSocketContext);

    const screen = useFullScreenHandle();

    const [broadcast_msg, setBroadcastMsg] = useState('');
    const [viewers, setViewers] = useState(1);
    const [user, setUser] = useState({ nickname: '', role: 'viewer' });
    const [current_slide, setSlide] = useState(-1);
    const [auth_token, setAuthToken] = useState(null);
    const [pdf, setPdf] = useState(null);

    const slide_ref = useRef(null);

    useEffect(() => {
        if (ready === ReadyState.OPEN) {
            setBroadcastMsg('Трансляция скоро начнется');

            let clicker_token = search_params.get('clicker');

            if (auth_token != null && auth_token.hasOwnProperty('access_token') && auth_token.access_token !== '')
                send({ 'access_token': auth_token.access_token });
            else if (clicker_token !== '')
                send({ 'clicker_token': clicker_token });
        }
    }, [ready, auth_token]);

    useEffect(() => {
        document.title = 'Трансляция';

        let token = fetchToken();

        if (token != null) {
            setAuthToken(token);

            let auth_user = getAuthUser();
            if (auth_user != null)
                editUser('nickname', auth_user.fname + ' ' + auth_user.lname);
        } else {
            setAuthToken({ access_token: '' });
        }

    }, []);

    useEffect(() => {
        // console.log('msg', msg);
        if (msg != null) {
            switch (msg.action) {
                case 'role':
                    editUser('role', msg.params.role);
                    break;
                case 'start':
                    setSlide(0);
                    break;
                case 'stop':
                    setSlide(-1);
                    setBroadcastMsg('Трансляция завершена');
                    break;
                case 'switch':
                    setSlide(msg.params.slide);
                    break;
                case 'joined':
                    setViewers(viewers + 1);
                    break;
                case 'left':
                    setViewers(viewers - 1);
                    break;
                default:
                    dispatch({ type: 'edit_per_msg', msg: msg });
            }
        }

    }, [msg]);

    useEffect(() => {

        let dataFetch = async () => {
            const data = await loadPresentation(uuid);

            if (data == null) {
                dispatch({ type: 'load_presentation', presentation: 0 });
                redirect('/error', { state: { code: 404, msg: 'Презентация не найдена' } });
                return;
            }

            if (data.presentation.slides.length == 0)
                setBroadcastMsg('Презентация еще не готова к трансляции');

            dispatch({ type: 'load_presentation', presentation: data.presentation });

            if (data.current_slide >= 0) {
                setSlide(data.current_slide);

                let slide_data = await loadCurrentSlideData(uuid, data.current_slide);
                dispatch({ data: slide_data.data, type: 'set_slide_data', slide: data.current_slide });

                setViewers(viewers + data.viewers);

                console.log(slide_data);
            }

            if (data.pdf != null)
                setPdf(`/${data.pdf}`);
        };

        dataFetch().then(r => { });
    }, [uuid]);


    let switchSlide = async (to) => {
        await createSlideImage();

        let num = getTargetSlideNum(current_slide, to, presentation.slides.length);
        setSlide(num);

        let switch_msg = { action: 'switch', params: { slide: num } };
        send(switch_msg);
    };

    let editUser = (property, value) => {
        setUser({ ...user, [property]: value });
    }

    useEffect(() => {
        window.addEventListener('beforeunload', alertUser);
        return () => {
            window.removeEventListener('beforeunload', alertUser);
        }
    }, [])

    const alertUser = e => {
        if (user.role !== 'viewer' && current_slide >= 0) {
            e.preventDefault();
            e.returnValue = '';
        }
    }

    let createSlideImage = async () => {
        if (presentation.slides[current_slide].type === 'comments')
            return;
        
        await toBlob(slide_ref.current, { cacheBust: false })
            .then((data) => {
                sendSlideImage(uuid, current_slide, data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    let downloadSlidesPdf = async () => {
        let path = await exportPdf(uuid);

        if (path == null)
            return;

        let link = document.createElement('a');

        link.href = `/${path}`;
        link.download = `${uuid}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    let stopBroadcastHandle = async () => {
        await createSlideImage();
        stopBroadcast(send, setSlide);
        let path = await exportPdf(uuid);

        if (path != null)
            setPdf(`/${path}`);
    }


    return (
        <>
            {
                presentation != null ?
                    <>
                        {
                            current_slide === -1
                                ?
                                <>
                                    <p className='caption-room-page'>{broadcast_msg}</p>
                                    <div className='start-pres one'>

                                        {
                                            user.role !== 'viewer' && presentation.slides.length > 0 ?
                                                <button className="btn btn-primary waves-effect waves-light" onClick={() => startBroadcast(send, setSlide)}>Начать трансляцию</button>
                                                :
                                                ''
                                        }
                                        {
                                            pdf != null ? <a className="btn btn-green" href={pdf} target='_blank'>Скачать материалы трансляции</a> : ''
                                        }
                                    </div>
                                </>
                                :
                                <FullScreen handle={screen}>

                                    <div className="center-block">

                                        <FullscreenContext.Provider value={screen.active}>
                                            <CurrentSlideNumContext.Provider value={current_slide}>
                                                <PresentationContext.Provider value={presentation}>
                                                    <BroadcastDispatchContext.Provider value={dispatch}>
                                                        <UserContext.Provider value={user}>

                                                            <div ref={slide_ref}>

                                                                <SlideView {...presentation.slides[current_slide]} slide_num={current_slide}></SlideView>

                                                            </div>

                                                        </UserContext.Provider>
                                                    </BroadcastDispatchContext.Provider>
                                                </PresentationContext.Provider>
                                            </CurrentSlideNumContext.Provider>
                                        </FullscreenContext.Provider>

                                        <div className="control-slide">
                                            {
                                                user.role !== 'viewer' ?
                                                    <>
                                                        <button title="Предыдущий" onClick={() => switchSlide('prev')}><i className="prev-s"></i></button>
                                                        <button title="Следующий" onClick={() => switchSlide('next')}><i className="next-s"></i></button>
                                                        <button title="Завершить" onClick={stopBroadcastHandle}><i className="stop-s"></i></button>
                                                    </>
                                                    : ''
                                            }
                                            {screen.active
                                                ?
                                                <button title="Выйти из полноэкранного режима" onClick={screen.exit}><i className="compress-s"></i></button>
                                                :
                                                <button title="В полноэкранный режим" onClick={screen.enter}><i className="expand-s"></i></button>
                                            }
                                            {current_slide > 0 ? <button  className="download-btn" title="Скачать материалы трансляции" onClick={downloadSlidesPdf}><i className="download-s"></i> <span className="download-text"> Скачать<br/>презентацию</span></button> : ''}
                                            <div className='member'>Участники: {viewers}</div>
                                        </div>

                                    </div>

                                </FullScreen>
                        }

                        <NicknameModal nickname={user.nickname} action={editUser}></NicknameModal>
                    </>
                    :
                    ''
            }
        </>
    );
}