import { SlideMini } from '@slides/slide';
import { useState, useContext } from 'react';
import { PresentationContext } from '@contexts/PresentationContext';
import { EditDispatchContext } from '@contexts/EditDispatchContext';
import { CurrentSlideNumContext} from '@contexts/CurrentSlideNumContext';


export default function SlidesLeftBlock(props) {
    const presentation = useContext(PresentationContext);
    const dispatch = useContext(EditDispatchContext);
    const current_slide = useContext(CurrentSlideNumContext);

    const [dragging_item, setDraggingItem] = useState(null);

    let handleDragStart = (e, item) => {
        setDraggingItem(item);
        e.dataTransfer.setData('text/plain', '');
    };

    let handleDragEnd = () => {
        setDraggingItem(null);
    };

    let handleDragOver = (e) => {
        e.preventDefault();
    };

    let handleDrop = (e, item) => {
        if (!dragging_item)
            return;

        const current = presentation.slides.indexOf(dragging_item);
        const target = presentation.slides.indexOf(item);

        if (current !== -1 && target !== -1)
            dispatch({ type: 'edit_order_slide', current: current, target: target })
    };

    let deleteHandle = async (i) => {
        await dispatch({ type: 'delete_slide', slide: i });
        switchHandle(i);
    }

    let switchHandle = (i) => {
        props.switchAction(i);
    } 

    return (
        <>
            <div className="left-block card-s">
                {(presentation.slides || []).map((slide, i) =>
                    <div key={i} onClick={() => switchHandle(i)}
                        className={ i == current_slide ? 'slide-thumb card-s active-th' : 'slide-thumb card-s'}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, slide)}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, slide)}
                    >
                        <div className="num-slide">{i + 1}
                        </div>
                        <button title="Удалить" className="delete-thumb" onClick={() => deleteHandle(i)}></button>
                        <SlideMini {...slide}></SlideMini>
                            </div>
                )}
            </div>
        </>
    );
}