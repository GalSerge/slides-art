export function TitleMiniObject(props) {
    return (
        <>
            <div className="thumb-caption">
                {props.title.length > 50 ? `${props.title.slice(0, 50)}...` : props.title}
                <img className="icon-th"src={props.object}></img>
            </div>
        </>
    );
}