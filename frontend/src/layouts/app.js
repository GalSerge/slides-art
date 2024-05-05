import {Col, Container, Row} from 'react-bootstrap';

export default function AppLayout(props) {
    return (
        <>
            <Container>
                <Row>
                    <Col>This is main layout!!!</Col>
                </Row>
                <Row>
                    <Col>{props.children}</Col>
                </Row>
            </Container>
        </>
    );
}