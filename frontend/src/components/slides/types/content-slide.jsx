import SlideEditArea from '@editor/slide-edit-area';
import SlideToolsArea from '@editor/slide-tools-area';

import { TitleMiniObject } from '@slides/layouts/title-mini-object';
import { TitleOneObject } from '@slides/layouts/title-one-object';
import { TitleTwoObjects } from '@slides/layouts/title-two-objects';
import { Title, Text, Image } from '@slides/elements';

import { TextEdit } from '@editor/elements/text-edit';
import { ImgEdit } from '@editor/elements/img-edit';

import { TextTools } from '@editor/tools/text-tools';
import { ImgTools } from '@editor/tools/img-tools';
import { BackgroundTools } from '@editor/tools/background-tools';

import ImageIcon from '@assets/images/layouts-icons/mini/th-ic-1.svg';


export function ContentSlideView(props) {
    let layout;

    if (props.data.hasOwnProperty('text') && props.data.hasOwnProperty('img')) {
        layout = TitleTwoObjects({ title: Title(props.data.title), left_object: Text(props.data.text), rigth_object: Image(props.data.img), background: props.background });
    } else if (props.data.hasOwnProperty('text')) {
        layout = TitleOneObject({ title: Title(props.data.title), object: Text(props.data.text), background: props.background });
    } else if (props.data.hasOwnProperty('img')) {
        layout = TitleOneObject({ title: Title(props.data.title), object: Image(props.data.img), background: props.background });
    }

    return (
        <>
            {layout}
        </>
    );
}

export function ContentSlideMini(props) {
    return (
        <TitleMiniObject title={props.data.title.text} object={ImageIcon} background={props.background}></TitleMiniObject>
    );
}

export function ContentSlideEdit(props) {
    const TitleInput = TextEdit({ text: props.data.title, element: 'title' });
    let TextInput;
    let ImgInput;
    let layout;

    const tools = [
        {
            title: 'Заголовок',
            tool: <TextTools meta={props.data.title.meta} element={'title'}></TextTools>
        }
    ];

    if (props.data.hasOwnProperty('text')) {
        TextInput = TextEdit({ text: props.data.text, element: 'text' });

        tools.push({
            title: 'Текст',
            tool: <TextTools meta={props.data.text.meta} element={'text'}></TextTools>
        });
    }

    if (props.data.hasOwnProperty('img')) {
        ImgInput = ImgEdit({ img: props.data.img });

        tools.push({
            title: 'Изображение',
            tool: <ImgTools img={props.data.img}></ImgTools>
        });
    }

    if (props.data.hasOwnProperty('text') && props.data.hasOwnProperty('img')) {
        layout = TitleTwoObjects({ title: TitleInput, left_object: TextInput, rigth_object: ImgInput, background: props.background });
    } else if (props.data.hasOwnProperty('text')) {
        layout = TitleOneObject({ title: TitleInput, object: TextInput, background: props.background });
    } else if (props.data.hasOwnProperty('img')) {
        layout = TitleOneObject({ title: TitleInput, object: ImgInput, background: props.background });
    }

    tools.push({
        title: 'Фон',
        tool: <BackgroundTools background={props.background}></BackgroundTools>
    });

    return (
        <>
            <SlideEditArea>
                {layout}
            </SlideEditArea>

            <SlideToolsArea tools={tools}>
            </SlideToolsArea>
        </>
    );
}