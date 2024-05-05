import { useState } from 'react';
import QRCode from 'react-qr-code';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export const Text = (props) => {
    return (
        <p style={props.meta}>{props.text}</p>
    );
}

export const Title = (props) => {
    return (
        <p style={props.meta}>{props.text}</p>
    );
}

export const Comments = (props) => {
    return (
        <div className="comment-block">
            <div className="chat-detail slimscroll">
                {(props.comments).map((comment, i) =>
                    <div key={i} className="media">
                        <div className="media-body">
                            <div className="chat-msg">
                                {comment.role === 'speaker' ?
                                    <div className="msg-author"><u>{comment.nick}</u></div>
                                    :
                                    <div className="msg-author">{comment.nick}</div>
                                }
                                <p>{comment.text}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export let QrCode = (props) => {
    return (
        <QRCode value={props.link} />
    );
};

export let Image = (props) => {
    return (
        <div className="image-block" style={{ backgroundImage: props.file !== '' ? `url(/${props.file})` : '' }}></div>
    );
}

export let Options = (props) => {
    return (
        <>
            <ButtonGroup vertical>
                {(props.options).map((option, i) =>
                    <Button key={i} style={{ backgroundColor: option.color }} onClick={() => props.action(i)} disabled={props.voted}>{option.text}</Button>
                )}
            </ButtonGroup>
        </>
    );
}

export let CommentInput = (props) => {
    const [comment, setComment] = useState('');

    let sendHandle = () => {
        if (comment !== '') {
            props.action(comment);
            setComment('');
        }
    }

    let changeCommentHandle = (value) => {
        if (value.length <= 150)
            setComment(value);
    }

    let onKeyDownHandle = (e) => {
        if (e.key === 'Enter')
            sendHandle();
    }

    return (
        <><div className='space-between py-2 comment-input'>
            <input
                type='text'
                onChange={(e) => changeCommentHandle(e.target.value)}
                value={comment}
                onKeyDown={onKeyDownHandle}
                className='input-comment form-control'
            ></input>
            <button onClick={sendHandle} className='btn btn-primary waves-effect waves-light'>
                Отправить
            </button>
            </div>
        </>
    );
}