import { API_SERVER } from '@constants';

import { fetchToken } from '@utils/auth';


export let loadCurrentSlideData = async (uuid, slide) => {
    try {
        const response = await fetch(`${API_SERVER}/presentation/${uuid}/slide/${slide}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        if (response.ok) {
            let result = await response.json();
            return result;
        }
    } catch (e) {
        return null;
    }

    return null;
};


export let getTargetSlideNum = (current_slide, to, length) => {
    let num = 0;

    if (to === 'prev' && current_slide > 0) {
        num = current_slide - 1;
    }
    else if (to === 'next' && current_slide < length - 1) {
        num = current_slide + 1;
    }

    return num;
}

export let startBroadcast = (send, setSlide) => {
    let msg = { action: 'start', params: {} };
    send(msg);

    setSlide(0);
}

export let stopBroadcast = (send, setSlide) => {
    let msg = { action: 'stop', params: {} };
    send(msg);

    setSlide(-1);
}

export let isVoted = (uuid, slide) => {
    return Boolean(sessionStorage.getItem(`voted:${uuid}:${slide}`));
}

export let saveVote = (uuid, slide) => {
    sessionStorage.setItem(`voted:${uuid}:${slide}`, 1);
}

export let sendSlideImage = (uuid, slide, data) => {
    let token = fetchToken();

    if (token == null)
        return;

    const form = new FormData();
    form.append('file', data, 'slide.png');

    try {
        fetch(`${API_SERVER}/presentation/${uuid}/slide/${slide}`,
            {
                method: 'POST',
                body: form,
                headers: {
                    'Authorization': `${token.token_type} ${token.access_token}`,
                }
            });
    } catch (e) {
        return;
    }
}

export let exportPdf = async (uuid) => {
    try {
        const response = await fetch(`${API_SERVER}/presentation/${uuid}/export-pdf`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        if (response.ok) {
            let result = await response.json();
            return result.pdf;
        }
    } catch (e) {
        return null;
    }

    return null;
} 