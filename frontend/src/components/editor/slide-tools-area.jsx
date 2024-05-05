import Accordion from 'react-bootstrap/Accordion';


export default function SlideToolsArea(props) {
    return (
        <>
            <div className="right-block card-s">
                {/* {(props.tools || []).map((t, i) =>
                    <div key={i} className="form-group">
                        <label className="label">{t.title}</label>
                        {t.tool}
                    </div>
                )} */}

                <Accordion alwaysOpen defaultActiveKey={0}>
                    {(props.tools || []).map((t, i) =>
                        <Accordion.Item eventKey={i} key={i}>
                            <Accordion.Header>{t.title}</Accordion.Header>
                            <Accordion.Body>
                                {t.tool}
                            </Accordion.Body>
                        </Accordion.Item>
                    )}
                </Accordion>
            </div>
        </>
    );
}