import SlideZone from './slide-zone';


export function TitleOneObject(props) {
    return (
        <>
            <SlideZone background={props.background}>
                <div className="content-slide">
                    {props.title}
               
                        {props.object}
                    
                </div>
            </SlideZone>
        </>
    );
}