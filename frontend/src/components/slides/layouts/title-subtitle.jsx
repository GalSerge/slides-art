import SlideZone from './slide-zone';

export function TitleSubtitle(props) {
    return (
        <>
            <SlideZone background={props.background}>
                <div className="content-slide">
                    <div className='flex vh-100'>
                        <div className='align-self-center wh-100pr'>
                            {props.title}
                            <br />
                            {props.subtitle}
                        </div>
                    </div>
                </div>
            </SlideZone>
        </>
    );
}