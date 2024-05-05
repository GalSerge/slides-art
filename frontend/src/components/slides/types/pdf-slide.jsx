import SlideEditArea from '@editor/slide-edit-area';
import SlideToolsArea from '@editor/slide-tools-area';

import { TitleMiniObject } from '@slides/layouts/title-mini-object';
import { ImageLayout } from '@slides/layouts/image-layout';

import ImageIcon from '@assets/images/layouts-icons/mini/th-ic-6.svg';


export function PdfSlideView(props) {
    return (
        <>
            <ImageLayout background={props.background}></ImageLayout>
        </>
    );
}

export function PdfSlideMini(props) {
    return (
        <TitleMiniObject title={''} object={ImageIcon} background={props.background}></TitleMiniObject>
    );
}

export function PdfSlideEdit(props) {
    return (
        <>
            <SlideEditArea>
                <ImageLayout background={props.background}></ImageLayout>
            </SlideEditArea>

            <SlideToolsArea tools={[]}>
            </SlideToolsArea>
        </>
    );
}