import SlideZone from './slide-zone';


export function TitleTwoObjects(props) {
    return (
        <>
            <SlideZone background={props.background}>
                <div className="content-slide vertical">
                    <div className="asas">
                        {props.title}
                        {props.left_object}
                    </div>
                    <div className="img-and-voite">
                        {props.rigth_object}
                    </div>
                </div>
            </SlideZone>
        </>
    );
}