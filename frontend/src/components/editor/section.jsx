export default function Section(props) {
    return (
        <>
            <section className="slide-grid">
                {props.children}
            </section>
        </>
    );
}