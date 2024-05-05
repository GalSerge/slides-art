import { useState, useContext, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import MainTitle from '@assets/images/layouts-icons/main-title.png';
import TitleText from '@assets/images/layouts-icons/title-txt.png';
import TitleImg from '@assets/images/layouts-icons/title-img.png';
import TitleTextImg from '@assets/images/layouts-icons/title-txt-img.png';

import { getNewSlideOptions, importPdfFile } from '@utils/presentation';

import { EditDispatchContext } from '@contexts/EditDispatchContext';


export default function TopBlock(props) {
    const dispatch = useContext(EditDispatchContext);
    const { uuid } = useParams();

    const [name, setName] = useState('');

    const [open, setOpen] = useState(false);

    let changeNameHandle = (value) => {
        setName(value);
    }

    let saveNameHandle = () => {
        dispatch({ type: 'edit_presentation_name', name: name });
    }

    useEffect(() => {
        setName(props.name);
    }, [props.name]);

    let addSlideHandle = async (type) => {
        let options = getNewSlideOptions(type);
        await dispatch({ type: 'add_new_slide', slide: options });
        props.switchAction(-1);
    }

    let addSlidesFromPdf = async (e) => {
        e.preventDefault();

        props.setSpinner(true);

        let images = await importPdfFile(uuid, e.target.files[0]);

        if (images !== null) {
            let options = getNewSlideOptions('pdf');
            await dispatch({ type: 'add_new_slides_from_pdf', slide: options, images: images });
        }

        props.setSpinner(false);
    }

    return (
        <>
            <div className="top-block card-s">
                <input type="text"
                    className='form-control'
                    value={name}
                    onChange={(e) => changeNameHandle(e.target.value)}
                    onBlur={saveNameHandle}
                    
                />

                <Button
                className="example-collapse-text"
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    aria-controls="example-collapse-text"
                >
                    Добавить слайд &#8594;
                </Button>

                
                    <Collapse in={open} dimension="width">
                        <div id="example-collapse-text" className='menu-add-slide'>

                            <DropdownButton id="dropdown-basic-button" title="Контент" className="dropdown-button-div">
                                <button onClick={() => addSlideHandle('content-head')} className="btn"><img alt="Заглавный слайд" title="Заглавный слайд" src={MainTitle} /></button>
                                <button onClick={() => addSlideHandle('content-text')} className="btn"><img alt="Текст" title="Текст" src={TitleText} /></button>
                                <button onClick={() => addSlideHandle('content-img')} className="btn"><img alt="Изображение" title="Изображение" src={TitleImg} /></button>
                                <button onClick={() => addSlideHandle('content-text-img')} className="btn"><img alt="Текст и изображение" title="Текст и изображение" src={TitleTextImg} /></button>
                            </DropdownButton>

                            <button onClick={() => addSlideHandle('comments')} className="btn btn-primary waves-effect waves-light">Комментарии</button>
                            <button onClick={() => addSlideHandle('voting')} className="btn btn-primary waves-effect waves-light">Голосование</button>
                            <button onClick={() => addSlideHandle('qrcode')} className="btn btn-primary waves-effect waves-light">QR&minus;код</button>

                        </div>
                    </Collapse>
               

                <div className="custom-file mt-0 ml-2">
                    <input type="file" className="custom-file-input" id="pdf1" accept="application/pdf" onChange={addSlidesFromPdf} />
                    <label className="btn btn-primary waves-effect waves-light" htmlFor="pdf1">Импорт PDF</label>
                </div>
            </div>
        </>
    );
}