import SlideZone from './slide-zone';


export function ImageLayout(props) {
    return (
        <>
            <SlideZone background={props.background}>
                <div className="content-slide">
                </div>
            </SlideZone>
        </>
    );
}