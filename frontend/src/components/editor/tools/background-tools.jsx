import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import ColorPicker from 'react-best-gradient-color-picker'
import Dropdown from 'react-bootstrap/Dropdown';

import { CurrentSlideNumContext } from '@contexts/CurrentSlideNumContext';
import { EditDispatchContext } from '@contexts/EditDispatchContext';

import { saveImageFile } from '@utils/presentation';


export const BackgroundTools = (props) => {
    const { uuid } = useParams();

    const current_slide = useContext(CurrentSlideNumContext);
    const dispatch = useContext(EditDispatchContext);

    const [file, setFile] = useState(props.background.file ?? null);
    const [color, setColor] = useState(props.background.style.background ?? 'rgba(255,255,255,1)');

    let changeColor = (color) => {
        setColor(color);
        setFile(null);
        saveBackground(color, 'background');
    }

    let changeFile = async (e) => {
        setFile(e.target.files[0]);
        let filename = await saveImageFile(uuid, e.target.files[0]);
        if (filename != null)
            saveBackground(`url(/${filename})`, 'backgroundImage', filename);
    }

    let saveBackground = (value, type, filename) => {
        if (type === 'backgroundImage')
            dispatch({ type: 'edit_slide_background', slide: current_slide, background: { style: { [type]: value }, file: filename } });
        else
            dispatch({ type: 'edit_slide_background', slide: current_slide, background: { style: { [type]: value } } });
    }

    let applyToAllHandle = () => {
        dispatch({ type: 'apply_background_to_all_slides', slide: current_slide });
    }

    return (
        <>
            <Dropdown className="space-between">
                <span className="label-rb">Цвет фона</span>
                <Dropdown.Toggle style={{ backgroundColor: color }} id='dropdown-background' className="color-change">
                </Dropdown.Toggle>

                <Dropdown.Menu >
                    <ColorPicker value={color ?? 'rgba(255,255,255,1)'}
                        onChange={(color) => changeColor(color)}
                        hideEyeDrop={true}
                        hideOpacity={true}
                        hideInputType={true}
                        hideInputs={true}
                        locales={{ CONTROLS: { SOLID: 'Цвет', GRADIENT: 'Градиент' } }}>
                    </ColorPicker>
                </Dropdown.Menu>
            </Dropdown>

            <div className="custom-file mt-2">
                <span className="label-rb">Фоновое изображение</span>
                <div className='ps'>
                    <input type="file" onChange={changeFile} className="custom-file-input" id="load_background_file" accept="image/*" />
                    <label className="custom-file-label" htmlFor="load_background_file">{file == null ? 'Выбрать файл' : 'Изменить файл'}</label>
                </div>
            </div>

            <button className="btn btn-dark mt-4" onClick={applyToAllHandle}>Применить ко всем слайдам</button>
        </>
    );
}