import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Copy from '@assets/images/copy.svg';
import Avatar from '@assets/images/avatar.png';
import Play from '@assets/images/play.svg';
import Slides from '@assets/images/slide.svg';

export default function Header(props) {
    let redirect = useNavigate();

    let playHandle = () => {
        window.open(`/room/${props.uuid}`, '_blank', 'noreferrer');
    }

    let toProfileHandle = () => {
        redirect('/profile');
    }

    return (
        <>
            <header>
                <div className="logo">
                    <img src={Slides} alt="Слайды" />
                    <div>
                        {props.success == null ? '' : props.success ? <span className="color-green">Изменения сохранены</span> : <span className="color-red">Не удалось сохранить изменения</span>}
                    </div>
                </div>
                <div className="button-header">

                    <div className="link-copy">
                        <div><span>Ссылка на презентацию: <a target="blank_" href={`http://slides-art.ru/room/${props.uuid}`}>http://slides-art.ru/room/{props.uuid}</a></span><br/>
                        <span>Ссылка управления: <a target="blank_" href={`http://slides-art.ru/room/${props.uuid}?clicker=${props.clicker_token}`}>http://slides-art.ru/room/{props.uuid}?clicker={props.clicker_token}</a></span></div>

                        {/* <button className="btn copy"
                            onClick={() => { navigator.clipboard.writeText(`https://slides-art.ru/room/${props.uuid}`) }}
                            title="Копировать ссылку"><img src={Copy} alt="Копировать ссылку на презентацию" /></button>

                        <button onClick={() => { navigator.clipboard.writeText(`https://slides-art.ru/room/${props.uuid}?clicker=${props.clicker_token}`) }}
                            title="Копировать ссылку" className='btn btn-green btn-copy-upr'>Ссылка управления</button> */}
                    </div>

                    <button onClick={playHandle} className="btn run waves-effect waves-light" title="Запуcтить презентацию">
                        <img src={Play} alt="Запустить трансляцию" />
                    </button>

                    <button onClick={toProfileHandle} className="avatar">
                        <img src={Avatar} alt="Профиль" />
                    </button>
                </div>
            </header>
        </>
    );
}