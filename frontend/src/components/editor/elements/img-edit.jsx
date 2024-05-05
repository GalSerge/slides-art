export function ImgEdit(props) {
    return (
        <>
            <div className="image-block" style={{ backgroundImage: props.img.file !== '' ? `url(/${props.img.file})` : 'url(https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg)' }}></div>
        </>
    );
}