import { useState, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import ColorPicker from 'react-best-gradient-color-picker'

import { CurrentSlideNumContext } from '@contexts/CurrentSlideNumContext';
import { EditDispatchContext } from '@contexts/EditDispatchContext';


export const VoteOptionsTools = (props) => {
    const current_slide = useContext(CurrentSlideNumContext);
    const dispatch = useContext(EditDispatchContext);

    const [options, setOptions] = useState([...props.options]);

    let saveColorHandle = (i, color) => {
        // options[i].color = color;
        // setOptions([...options]);

        dispatch({ type: 'edit_slide_option', slide: current_slide, option: i, property: 'color', value: color });
    }

    let changeTextOptionHandle = (i, value) => {
        options[i].text = value;
        setOptions([...options]);
    }

    let saveTextOption = (i, value) => {
        dispatch({ type: 'edit_slide_option', slide: current_slide, option: i, property: 'text', value: value });
    }

    let deleteHandle = (i) => {
        if (i >= 0 && i < options.length && options.length > 2) {
            options.splice(i, 1);
            setOptions([...options]);

            dispatch({ type: 'delete_slide_option', slide: current_slide, option: i });
        }
    }

    let addHandle = () => {
        if (options.length >= 6)
            return;

        let option = { text: '', votes: 0, color: 'rgba(0,0,255,1)' };

        options.push(option);
        setOptions([...options]);

        dispatch({ type: 'add_slide_option', slide: current_slide, option: option });
    }

    return (
        <>
            <ul className='vote-edit'>
                {(options || []).map((option, i) =>
                    <li key={i} className='mb-5'> 
                        <span className="label-rb">Текст варианта</span>
                        <textarea value={option.text} className='form-control'
                            onBlur={(e) => saveTextOption(i, e.target.value)}
                            onChange={(e) => changeTextOptionHandle(i, e.target.value)}
                        />
                        <Dropdown className="space-between  mt-2 mb-2">
                            <span className="label-rb">Цвет шкалы</span>
                            <Dropdown.Toggle style={{ background: option.color ?? 'rgba(0,0,255,1)' }} id='dropdown-color' className="color-change">
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <ColorPicker value={option.color ?? 'rgba(0,0,255,1)'}
                                    onChange={(color) => saveColorHandle(i, color)}
                                    hideControls={true}
                                    hideOpacity={true}
                                    hideInputs={true}>
                                </ColorPicker>
                            </Dropdown.Menu>
                        </Dropdown>
                        <button className="btn btn-danger" onClick={() => deleteHandle(i)} disabled={options.length <= 2}>Удалить</button>
                    </li>
                )}
            </ul>
            <button className="btn btn-primary waves-effect waves-light" onClick={addHandle} disabled={options.length >= 6}>Добавить</button>
        </>
    );
}