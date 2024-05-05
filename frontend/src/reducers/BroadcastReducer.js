export default function BroadcastReducer(presentation, action) {
    if (action.type !== 'load_presentation' && presentation === null)
        throw Error('Presentation don\'t load');
    else if (action.type === 'load_presentation') {
        return action.presentation;
    } else if (action.type === 'set_voted') {
        sessionStorage.setItem(`voted:${action.uuid}:${action.slide}`, 1);
        return { ...presentation };
    } else if (action.type === 'set_slide_data') {
        switch (presentation.slides[action.slide].type) {
            case 'voting': {
                for (const [key, value] of Object.entries(action.data)) {
                    presentation.slides[action.slide].data.options[key].votes += Number(value);
                }
                return { ...presentation };
            }
            case 'comments': {
                const full_list = action.data.concat(presentation.slides[action.slide].data.list);
                presentation.slides[action.slide].data.list = full_list;

                return { ...presentation };
            } default: {
                return { ...presentation };
            }
        }
    }
    else if (action.type === 'edit_per_msg') {
        switch (action.msg.action) {
            case 'vote': {
                presentation.slides[action.msg.params.slide].data.options[action.msg.params.option].votes += 1;
                return { ...presentation };
            }
            case 'comment': {
                presentation.slides[action.msg.params.slide].data.list.unshift(action.msg.params);
                console.log(presentation);
                return { ...presentation };
            }
            default: {
                return { ...presentation };
            }
        }
    } else {
        return { ...presentation };
    }
}