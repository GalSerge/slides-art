import { useContext, useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import ReactApexChart from 'react-apexcharts'

import SlideEditArea from '@editor/slide-edit-area';
import SlideToolsArea from '@editor/slide-tools-area';

import { TitleMiniObject } from '@slides/layouts/title-mini-object';
import { TitleOneObject } from '@slides/layouts/title-one-object';
import { TitleTwoObjects } from '@slides/layouts/title-two-objects';
import { Title, Options } from '@slides/elements';

import { TextEdit } from '@editor/elements/text-edit';
import { TextTools } from '@editor/tools/text-tools';
import { BackgroundTools } from '@editor/tools/background-tools';

import { WebSocketContext } from '@contexts/WebSocketContext';
import { BroadcastDispatchContext } from '@contexts/BroadcastDispatchContext';

import { VoteOptionsTools } from '@editor/tools/vote-options-tools';

import { getVotingChartsOptions } from '@utils/presentation';
import ImageIcon from '@assets/images/layouts-icons/mini/th-ic-2.svg';

import { isVoted, saveVote } from '@utils/broadcast';


export function VotingSlideView(props) {
    const { uuid } = useParams();

    const [send, _, ready] = useContext(WebSocketContext);
    const dispatch = useContext(BroadcastDispatchContext);

    const [series, setSeries] = useState([{
        data: []
    }]);

    const [is_voted, setIsVoted] = useState(false);

    const options = getVotingChartsOptions();
    options.colors = props.data.options.map(option => option.color);

    const chart = <ReactApexChart options={options} series={series} width={'100%'} height={'80%'} type={'bar'} />;

    useEffect(() => {
        let data = props.data.options.map((option, i) => {
            return {
                x: option.text,
                y: option.votes,
                fillColor: option.color
            }
        });

        setSeries([{
            data: data
        }]);
    }, [props]);

    let voteHandle = (i) => {
        saveVote(uuid, props.slide_num);
        setIsVoted(true);

        let msg = { action: 'vote', params: { option: i, slide: props.slide_num } };

        dispatch({ type: 'edit_per_msg', msg: msg });
        send(msg);
    };

    useEffect(() => {
        setIsVoted(isVoted(uuid, props.slide_num));
    }, []);

    const left_block =
        <div>
            <Title {...props.data.title}></Title>
            <div className='options-voite'>
                <p>Варианты ответов:</p>
                <Options {...props.data} action={voteHandle} voted={is_voted}></Options>
            </div>
        </div>;

    return (
        <>
            <TitleTwoObjects title={left_block} rigth_object={chart}></TitleTwoObjects>
        </>
    );
}

export function VotingSlideMini(props) {
    return (
        <TitleMiniObject title={props.data.title.text} object={ImageIcon}></TitleMiniObject>
    );
}

export function VotingSlideEdit(props) {
    const TitleInput = TextEdit({ text: props.data.title, element: 'title' });

    const tools = [
        {
            title: 'Заголовок',
            tool: <TextTools meta={props.data.title.meta} element={'title'}></TextTools>
        },
        {
            title: 'Голосование',
            tool: <VoteOptionsTools options={props.data.options}></VoteOptionsTools>
        },
        {
            title: 'Фон',
            tool: <BackgroundTools background={props.background}></BackgroundTools>
        }
    ];

    return (
        <>
            <SlideEditArea>
                <TitleOneObject title={TitleInput} object={''} background={props.background}></TitleOneObject>
            </SlideEditArea>

            <SlideToolsArea tools={tools}>
            </SlideToolsArea>
        </>
    );
}