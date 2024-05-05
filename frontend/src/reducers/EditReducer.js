export default function EditReducer(presentation, action) {
    if (action.type !== 'load_presentation' && presentation === null)
        throw Error('Presentation don\'t load');

    switch (action.type) {
        case 'load_presentation': {
            presentation = action.presentation;
            return presentation;
        }
        case 'edit_presentation_name': {
            presentation.name = action.name;
            return { ...presentation };
        }
        case 'edit_slide_text': {
            presentation.slides[action.slide].data[action.element].text = action.text;
            return { ...presentation };
        }
        case 'edit_slide_text_meta': {
            presentation.slides[action.slide].data[action.element].meta[action.property] = action.value;
            return { ...presentation };
        }
        case 'edit_slide_option': {
            presentation.slides[action.slide].data.options[action.option][action.property] = action.value;
            return { ...presentation };
        }
        case 'add_slide_option': {
            presentation.slides[action.slide].data.options.push(action.option);
            return { ...presentation };
        }
        case 'delete_slide_option': {
            presentation.slides[action.slide].data.options.splice(action.option, 1);
            return { ...presentation };
        }
        case 'edit_slide_img': {
            presentation.slides[action.slide].data.img.file = action.file;
            return { ...presentation };
        }
        case 'edit_slide_background': {
            presentation.slides[action.slide].background = action.background;
            return { ...presentation };
        }
        case 'add_new_slide': {
            presentation.slides.push(action.slide);
            return { ...presentation };
        }
        case 'delete_slide': {
            presentation.slides.splice(action.slide, 1);
            return { ...presentation };
        }
        case 'edit_order_slide': {
            let slide = presentation.slides[action.current];
            presentation.slides.splice(action.current, 1);
            presentation.slides.splice(action.target, 0, slide);
            return { ...presentation };
        }
        case 'add_new_slides_from_pdf': {
            let slides = presentation.slides;
            for (let i = 0; i < action.images.length; i++) {
                slides.push({
                    ...action.slide,
                    background: {
                        style:
                            { backgroundImage: `url(/${action.images[i]})` },
                        file: action.images[i]
                    }
                });
            }

            presentation.slides = slides;

            return { ...presentation };
        }
        case 'apply_background_to_all_slides': {
            presentation.default_styles.background = { ...presentation.slides[action.slide].background };

            for (let i = 0; i < presentation.slides.length; i++) {
                if (presentation.slides[i].type !== 'pdf')
                    presentation.slides[i].background = { ...presentation.slides[action.slide].background };
            }

            return { ...presentation };
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}