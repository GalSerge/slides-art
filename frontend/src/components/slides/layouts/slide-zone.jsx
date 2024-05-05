import { useContext } from 'react';
import { FullscreenContext } from '@contexts/FullscreenContext';


export default function SlideZone(props) {
    const fullscreen = useContext(FullscreenContext);

    return (
        <>
            <div className={fullscreen ? 'slide-zone sz-fullscreen' : 'slide-zone'} style={{ ...props.background?.style }}>
                {props.children}
            </div>
        </>
    );
}