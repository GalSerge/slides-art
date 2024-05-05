import { API_SERVER } from '@constants';

//import elements from '@assets/slides/elements';
import * as elements from '@utils/elements';

import { fetchToken } from '@utils/auth';


export let loadPresentation = async (uuid) => {
    try {
        const response = await fetch(`${API_SERVER}/presentation/${uuid}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',

                }
            });

        if (response.ok)
            return await response.json();
    } catch (e) {
        return null;
    }
    return null;
};


export let loadPresentationForEdit = async (uuid) => {
    let token = fetchToken();

    if (token == null)
        return null;
    
    try {
        const response = await fetch(`${API_SERVER}/presentation/${uuid}/for-edit`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token.token_type} ${token.access_token}`,
                }
            });

        if (response.ok)
            return await response.json();
    } catch (e) {
        return null;
    }
    return null;
};


export let getVotingChartsOptions = () => {

    return {
        chart: {
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        colors: ['#0011F9', '#009009', '#6f0f19'],
        plotOptions: {
            bar: {

                columnWidth: '60%',
                distributed: true,
                dataLabels: {
                    position: 'bottom',
                },
            }
        },
        dataLabels: {
            enabled: true,
            FontWeight: 500,

            style: {
                fontSize: '20em',
            },

            background: {
                enabled: true,
                foreColor: '#303e67',
            }
        },
        legend: {
            show: false,
            position: 'left',
            fontSize: '24em',
            markers: {
                width: 24,
                height: 24
            }
        },
        tooltip: { enabled: false },
        xaxis: {
            labels: {
                show: false
            }
        }
    };
};


export let getNewSlideOptions = (type) => {
        switch (type) {
        case 'content-head': {
            return {
                type: 'head',
                background: elements.backgroundColor(),
                data: {
                    title: elements.title(),
                    subtitle: elements.subtitle()
                }
            };
        }
        case 'content-text': {
            return {
                type: 'content',
                background: elements.backgroundColor(),
                data: {
                    title: elements.title(),
                    text: elements.text()
                }
            };
        }
        case 'content-img': {
            return {
                type: 'content',
                background: elements.backgroundColor(),
                data: {
                    title: elements.title(),
                    img: elements.img()
                }
            };
        }
        case 'content-text-img': {
            return {
                type: 'content',
                background: elements.backgroundColor(),
                data: {
                    title: elements.title(),
                    text: elements.text(),
                    img: elements.img()
                }
            };
        }
        case 'comments': {
            return {
                type: 'comments',
                background: elements.backgroundColor(),
                data: {
                    title: elements.title(),
                    list: [],
                }
            };
        }
        case 'voting': {
            return {
                type: 'voting',
                background: elements.backgroundColor(),
                data: {
                    title: elements.title(),
                    options: elements.options(),
                }
            };
        }
        case 'qrcode': {
            return {
                type: 'qrcode',
                background: elements.backgroundColor(),
                data: {
                    title: elements.title()
                }
            };
        }
        case 'pdf': {
            return {
                type: 'pdf',
                background: elements.backgroundFile()
            };
        }
        default: {
            return {
                type: 'content',
                background: elements.backgroundColor(),
                data: {
                    title: elements.title(),
                    text: elements.text()
                }
            };
        }
    }
}

export let saveImageFile = async (uuid, file) => {
    let token = fetchToken();

    if (token == null)
        return null;

    const form = new FormData();
    form.append('file', file);

    try {
        const response = await fetch(`${API_SERVER}/presentation/${uuid}/upload-image`,
            {
                method: 'POST',
                body: form,
                headers: {
                    'Authorization': `${token.token_type} ${token.access_token}`,
                }
            });

        if (response.ok) {
            let result = await response.json();
            return result.filename;
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
}

export let importPdfFile = async (uuid, file) => {
    let token = fetchToken();

    if (token == null)
        return null;

    const form = new FormData();
    form.append('file', file);

    try {
        const response = await fetch(`${API_SERVER}/presentation/${uuid}/import-pdf`,
            {
                method: 'POST',
                body: form,
                headers: {
                    'Authorization': `${token.token_type} ${token.access_token}`,
                }
            });
        if (response.ok) {
            let result = await response.json();
            return result.images;
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
}

export let getInviteLink = (uuid) => {
    return `http://slides-art.ru/room/${uuid}`;
}

export let savePresentation = async (uuid, presentation) => {
    let token = fetchToken();

    if (token == null)
        return false;

    try {
        const response = await fetch(`${API_SERVER}/presentation/${uuid}/save`,
            {
                method: 'POST',
                body: JSON.stringify(presentation),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token.token_type} ${token.access_token}`,
                }
            });

        return response.ok;
    } catch (e) {
        return false;
    }
}

export let loadUserPresentations = async () => {
    let token = fetchToken();

    if (token == null)
        return [];

    try {
        const response = await fetch(`${API_SERVER}/user/presentations`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token.token_type} ${token.access_token}`,
                }
            });

        if (response.ok)
            return await response.json();
        else
            return [];
    } catch (e) {
        return [];
    }
}

export let deletePresentation = async (uuid) => {
    let token = fetchToken();

    if (token == null)
        return false;

    try {
        const response = await fetch(`${API_SERVER}/presentation/${uuid}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token.token_type} ${token.access_token}`,
                }
            });

        return response.ok;
    } catch (e) {
        return false;
    }
}

export let createNewPresentation = async (name) => {
    let token = fetchToken();

    if (token == null)
        return false;

    try {
        const response = await fetch(`${API_SERVER}/presentation/create`,
            {
                method: 'POST',
                body: JSON.stringify({ name: name }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token.token_type} ${token.access_token}`,
                }
            });

        if (response.ok)
            return await response.json();
        else
            return null;
    } catch (e) {
        return null;
    }
}


