import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { CurrentSlideNumContext } from '@contexts/CurrentSlideNumContext';
import { EditDispatchContext } from '@contexts/EditDispatchContext';

import { saveImageFile } from '@utils/presentation';

export function ImgTools(props) {
    const { uuid } = useParams();

    const current_slide = useContext(CurrentSlideNumContext);
    const dispatch = useContext(EditDispatchContext);

    const [file, setFile] = useState(props.img.file !== '' ? props.img.file : null);

    let changeFile = async (e) => {
        setFile(e.target.files[0]);
        let filename = await saveImageFile(uuid, e.target.files[0]);
        if (filename != null)
            dispatch({ type: 'edit_slide_img', slide: current_slide, file: filename });
    }

    return (
        <>
            <div className="custom-file">
                <input type="file" onChange={changeFile} className="custom-file-input" id="load_image_file" accept="image/*" />
                <label className="custom-file-label" htmlFor="load_image_file">{file == null ? 'Выбрать файл' : 'Изменить файл'}</label>
            </div>
        </>
    );
}