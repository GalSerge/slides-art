import { useParams } from 'react-router-dom';

import QRCode from 'react-qr-code';

import SlideEditArea from '@editor/slide-edit-area';
import SlideToolsArea from '@editor/slide-tools-area';

import { TitleMiniObject } from '@slides/layouts/title-mini-object';
import { TitleOneObject } from '@slides/layouts/title-one-object';
import { Title } from '@slides/elements';

import { TextEdit } from '@editor/elements/text-edit';
import { TextTools } from '@editor/tools/text-tools';
import { BackgroundTools } from '@editor/tools/background-tools';

import { getInviteLink } from '@utils/presentation';

import ImageIcon from '@assets/images/layouts-icons/mini/th-ic-3.svg';


export function QrCodeSlideView(props) {
    const { uuid } = useParams();
    const link = getInviteLink(uuid);

    const object = <div className='qr-code-object'><QRCode value={link}></QRCode></div>;

    return (
        <>
            <TitleOneObject title={Title(props.data.title)} object={object}></TitleOneObject>
        </>
    );
}

export function QrCodeSlideMini(props) {
    return (
        <TitleMiniObject title={props.data.title.text} object={ImageIcon}></TitleMiniObject>
    );
}

export function QrCodeSlideEdit(props) {
    const { uuid } = useParams();
    const link = getInviteLink(uuid);

    const object = <div className='qr-code-object'><QRCode value={link}></QRCode></div>;


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
                <TitleOneObject title={TitleInput} object={object} background={props.background}></TitleOneObject>
            </SlideEditArea>

            <SlideToolsArea tools={tools}>
            </SlideToolsArea>
        </>
    );
}