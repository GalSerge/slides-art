import { useContext } from 'react';

import SlideEditArea from '@editor/slide-edit-area';
import SlideToolsArea from '@editor/slide-tools-area';

import { TitleMiniObject } from '@slides/layouts/title-mini-object';
import { TitleOneObject } from '@slides/layouts/title-one-object';
import { Title, Comments, CommentInput } from '@slides/elements';

import { TextEdit } from '@editor/elements/text-edit';
import { TextTools } from '@editor/tools/text-tools';
import { BackgroundTools } from '@editor/tools/background-tools';

import { WebSocketContext } from '@contexts/WebSocketContext';
import { BroadcastDispatchContext } from '@contexts/BroadcastDispatchContext';
import { UserContext } from '@contexts/UserContext';

import ImageIcon from '@assets/images/layouts-icons/mini/th-ic-4.svg';

export function CommentsSlideView(props) {
    const [send, _, ready] = useContext(WebSocketContext);
    const dispatch = useContext(BroadcastDispatchContext);
    const user = useContext(UserContext);

    let commentHandle = (text) => {
        let msg = { action: 'comment', params: { role: user.role, nick: user.nickname, text: text, slide: props.slide_num } };

        dispatch({ type: 'edit_per_msg', msg: msg });
        console.log(msg);
        send(msg);
        console.log('ses');
    };

    const comments =
        <>
            <Comments comments={props.data.list}></Comments>
            <CommentInput action={commentHandle}></CommentInput>
        </>;

    return (
        <>
            <TitleOneObject title={Title(props.data.title)} object={comments} background={props.background}></TitleOneObject>
        </>
    );
}


export function CommentsSlideMini(props) {
    return (
        <TitleMiniObject title={props.data.title.text} object={ImageIcon}></TitleMiniObject>
    );
}

export function CommentsSlideEdit(props) {
    const TitleInput = TextEdit({ text: props.data.title, element: 'title' });

    const tools = [
        {
            title: 'Заголовок',
            tool: <TextTools meta={props.data.title.meta} element={'title'}></TextTools>
        },
        {
            title: 'Фон',
            tool: <BackgroundTools background={props.background}></BackgroundTools>
        }
    ];

    return (
        <>
            <SlideEditArea>
                <TitleOneObject title={TitleInput} object={''} background={props.background}></TitleOneObject>
            </SlideEditArea>

            <SlideToolsArea tools={tools}>
            </SlideToolsArea>
        </>
    );
}