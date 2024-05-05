import SlideEditArea from '@editor/slide-edit-area';
import SlideToolsArea from '@editor/slide-tools-area';

import { TitleMiniObject } from '@slides/layouts/title-mini-object';
import { TitleSubtitle } from '@slides/layouts/title-subtitle';
import { Title } from '@slides/elements';

import { TextEdit } from '@editor/elements/text-edit';

import { TextTools } from '@editor/tools/text-tools';
import { BackgroundTools } from '@editor/tools/background-tools';

import ImageIcon from '@assets/images/layouts-icons/mini/th-ic-1.svg';


export function HeadSlideView(props) {

    return (
        <>
            <TitleSubtitle title={Title(props.data.title)} subtitle={Title(props.data.subtitle)} background={props.background}></TitleSubtitle>
        </>
    );
}

export function HeadSlideMini(props) {
    return (
        <TitleMiniObject title={props.data.title.text} object={ImageIcon}></TitleMiniObject>
    );
}

export function HeadSlideEdit(props) {
    const TitleInput = TextEdit({ text: props.data.title, element: 'title' });
    const SubtitleInput = TextEdit({ text: props.data.subtitle, element: 'subtitle' });

    const tools = [
        {
            title: 'Заголовок',
            tool: <TextTools meta={props.data.title.meta} element={'title'}></TextTools>
        },
        {
            title: 'Подзаголовок',
            tool: <TextTools meta={props.data.subtitle.meta} element={'subtitle'}></TextTools>
        },
        {
            title: 'Фон',
            tool: <BackgroundTools background={props.background}></BackgroundTools>
        }
    ];

    return (
        <>
            <SlideEditArea>
                <TitleSubtitle title={TitleInput} subtitle={SubtitleInput} background={props.background}></TitleSubtitle>
            </SlideEditArea>

            <SlideToolsArea tools={tools}>
            </SlideToolsArea>
        </>
    );
}