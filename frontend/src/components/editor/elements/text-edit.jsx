import { useState, useContext } from 'react';

import { CurrentSlideNumContext } from '@contexts/CurrentSlideNumContext';
import { EditDispatchContext } from '@contexts/EditDispatchContext';

export function TextEdit(props) {
    const current_slide = useContext(CurrentSlideNumContext);
    const dispatch = useContext(EditDispatchContext);

    const [text, setText] = useState(props.text.text);

    let changeTextHandle = (value) => {
        setText(value);
    }

    let onBlurHandle = () => {
        dispatch({type: 'edit_slide_text', slide: current_slide, element: props.element, text: text})
    }

    return (
        <>
            <textarea
                style={{ ...props.text.meta, background: 'transparent' }}
                onChange={(e) => changeTextHandle(e.target.value)}
                onBlur={() => onBlurHandle()}
                value={text}>
            </textarea>
        </>
    );
}

