import { useState, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ColorPicker from 'react-best-gradient-color-picker'

import { CurrentSlideNumContext } from '@contexts/CurrentSlideNumContext';
import { EditDispatchContext } from '@contexts/EditDispatchContext';

import EndIcon from '@assets/images/text-align-icons/r.svg';
import StartIcon from '@assets/images/text-align-icons/l.svg';
import CenterIcon from '@assets/images/text-align-icons/c.svg';
import JustifyIcon from '@assets/images/text-align-icons/j.svg';


export const TextTools = (props) => {
    const current_slide = useContext(CurrentSlideNumContext);
    const dispatch = useContext(EditDispatchContext);

    const [checked_font_style, setCheckedFontStyle] = useState(false);
    const [checked_font_weight, setCheckedFontWeight] = useState(false);
    const [checked_text_decoration, setCheckedTextDecoration] = useState(false);

    let font_sizes = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    let text_aligns = { 'start': StartIcon, 'end': EndIcon, 'center': CenterIcon, 'justify': JustifyIcon };

    let saveMetaHandle = (value, property) => {
        dispatch({ type: 'edit_slide_text_meta', slide: current_slide, element: props.element, property: property, value: value })
    }

    let onSelectFontSize = (eventKey, event) => {
        saveMetaHandle(eventKey + 'em', 'fontSize');
    }

    let onSelectTextAlign = (eventKey, event) => {
        saveMetaHandle(eventKey, 'textAlign');
    }

    let checkFontStyle = (checked) => {
        setCheckedFontStyle(checked);
        if (checked)
            saveMetaHandle('italic', 'fontStyle');
        else
            saveMetaHandle('', 'fontStyle');
    }

    let checkFontWeight = (checked) => {
        setCheckedFontWeight(checked);

        if (checked)
            saveMetaHandle('bold', 'fontWeight');
        else
            saveMetaHandle('', 'fontWeight');
    }

    let checkTextDecoration = (checked) => {
        setCheckedTextDecoration(checked);

        if (checked)
            saveMetaHandle('underline', 'textDecoration');
        else
            saveMetaHandle('', 'textDecoration');
    }

    let changeColor = (color) => {
        saveMetaHandle(color, 'color');
    }

    return (
        <>

            <Dropdown onSelect={onSelectFontSize} className="space-between">
                <span className="label-rb">Размер шрифта</span>
                <Dropdown.Toggle variant='primary' id='dropdown-font-size'>

                    {props.meta.fontSize.replace('em', '')}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {font_sizes.map((size, i) =>
                        <Dropdown.Item eventKey={size} key={i}>{size}</Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="space-between">
                <span className="label-rb">Цвет текста</span>
                <Dropdown.Toggle style={{ background: props.meta.color ?? '#000' }} id='dropdown-color' className='color-change'>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <ColorPicker value={props.meta.color ?? 'rgba(0,0,0,1)'} onChange={changeColor} hideControls={true} hideOpacity={true} hideInputs={true}></ColorPicker>

                    {/* <CompactPicker color={{hex: props.meta.color ?? '#000'}} onChangeComplete={changeColor}></CompactPicker> */}
                </Dropdown.Menu>
            </Dropdown>

            <Dropdown onSelect={onSelectTextAlign} className="space-between text-align">
                <span className="label-rb">Выравнивание</span>

                <Dropdown.Toggle variant='primary' id='dropdown-color'>
                    <img src={text_aligns[props.meta.textAlign ?? 'start']}></img>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {Object.entries(text_aligns).map(
                        ([align, icon], i) =>
                            <Dropdown.Item eventKey={align} key={i}><img src={icon}></img></Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
            <div className="space-between">
                <span className="label-rb">Стиль</span>
                <div className="style-font">
                    <ToggleButton
                        id='check-font-style'
                        type='checkbox'
                        variant='primary'
                        checked={checked_font_style}
                        value='1'
                        onChange={(e) => checkFontStyle(e.currentTarget.checked)}
                    >
                        <i>К</i>
                    </ToggleButton>

                    <ToggleButton
                        id='check-font-weight'
                        type='checkbox'
                        variant='primary'
                        checked={checked_font_weight}
                        value='1'
                        onChange={(e) => checkFontWeight(e.currentTarget.checked)}
                    >
                        <strong>Ж</strong>
                    </ToggleButton>

                    <ToggleButton
                        id='check-text-decoration'
                        type='checkbox'
                        variant='primary'
                        checked={checked_text_decoration}
                        value='1'
                        onChange={(e) => checkTextDecoration(e.currentTarget.checked)}
                    >
                        <span style={{ textDecoration: 'underline' }}>Ч</span>
                    </ToggleButton>
                </div></div>

        </>
    );
}