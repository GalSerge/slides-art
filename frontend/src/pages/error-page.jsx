import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

export default function ErrorPage(props) {
    let location = useLocation();

    useEffect(() => {
        document.title = 'Произошла ошибка';
      }, [])

    return (
        <>
            <h1>{location.state?.code}</h1>
            <p>{location.state != null && location.state.hasOwnProperty('msg') ? location.state.msg : 'Произошла ошибка...'}</p>
        </>
    );
}