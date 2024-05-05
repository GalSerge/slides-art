import * as Content from './types/content-slide';
import * as Head from './types/head-slide';
import * as Comments from './types/comments-slide';
import * as Voting from './types/voting-slide';
import * as QrCode from './types/qrcode-slide';
import * as Pdf from './types/pdf-slide';

export const SlideView = (props) => {
    return SlideSwitcher(props);
}

export const SlideMini = (props) => {
    return SlideSwitcher(props, 'Mini');
}

export const SlideEdit = (props) => {
    return SlideSwitcher(props, 'Edit');
}

const SlideSwitcher = (props, spec = 'view') => {
    spec = spec.charAt(0).toUpperCase() + spec.slice(1).toLowerCase();

    switch (props.type) {
        case 'content': {
            const SlideComponent = Content['ContentSlide' + spec];
            return <SlideComponent {...props} />;
        }
        case 'head': {
            const SlideComponent = Head['HeadSlide' + spec];
            return <SlideComponent {...props} />;
        }
        case 'comments': {
            const SlideComponent = Comments['CommentsSlide' + spec];
            return <SlideComponent {...props} />;
        }
        case 'voting': {
            const SlideComponent = Voting['VotingSlide' + spec];
            return <SlideComponent {...props} />;
        }
        case 'qrcode': {
            const SlideComponent = QrCode['QrCodeSlide' + spec];
            return <SlideComponent {...props} />;
        }
        case 'pdf': {
            const SlideComponent = Pdf['PdfSlide' + spec];
            return <SlideComponent {...props} />;
        }
        default: {
            return <></>;
        }
    }
}