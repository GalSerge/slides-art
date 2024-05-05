export let title = () => {
    return {
        meta: {
            fontSize: "36em",
            color: "rgba(0,0,0,1)"
        },
        text: "Заголовок слайда"
    };
}

export let subtitle = () => {
    return {
        meta: {
            fontSize: "28em",
            color: "rgba(0,0,0,1)"
        },
        text: "Подзаголовок"
    };
}

export let text = () => {
    return {
        meta: {
            fontSize: "24em",
            color: "rgba(0,0,0,1)"
        },
        text: "Текст"
    };
}

export let img = () => {
    return {
        meta: {},
        file: ""
    };
}

export let options = () => {
    return [
        {
            text: "Вариант 1",
            votes: 0,
            color: "rgba(0,0,255,1)"
        },
        {
            text: "Вариант 2",
            votes: 0,
            color: "rgba(0,255,0,1)"
        }
    ];
}

export let backgroundColor = () => {
    return {
        style: {
            background: "rgba(255,255,255,1)"
        }
    };
}

export let backgroundFile = () => {
    return {
        style: "",
        file: ""
    }
}
