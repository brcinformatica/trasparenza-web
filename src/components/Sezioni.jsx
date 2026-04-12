import { Container, Accordion, AccordionItem, AccordionHeader, AccordionBody } from "design-react-kit";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "design-react-kit";

const ListaSezioni = ({ sezioni, codCli, mobile }) => (
    mobile ? (
        <ul className="list-unstyled m-0">
            {sezioni.map((sezione, index) => (
                <li key={index}>
                    <Link
                        to={'/' + codCli + '/sezione/' + sezione.id}
                        className="d-flex justify-content-between align-items-center py-3 px-2 border-bottom text-decoration-none text-dark"
                    >
                        <span>{sezione.etichetta}</span>
                        <Badge color='primary'>{sezione.numero_contenuti}</Badge>
                    </Link>
                </li>
            ))}
        </ul>
    ) : (
        <ul className="it-list border-top">
            {sezioni.map((sezione, index) => (
                <li key={index}>
                    <Link to={'/' + codCli + '/sezione/' + sezione.id} className="list-item">
                        <div className="it-right-zone">
                            <span className="text">{sezione.etichetta}</span>
                            <Badge color='primary'>{sezione.numero_contenuti}</Badge>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    )
);

const Sezioni = () => {
    const apiUrl = 'https://api.myscuola.it';
    const { codCli } = useParams();
    const [sezioni, setSezioni] = useState(null);
    const [aperto, setAperto] = useState(false);

    useEffect(() => {
        axios.get(apiUrl + '/api/rest/v1/amt/sezioni/' + codCli).then(res => {
            if (res.data.success) setSezioni(res.data.payload);
        });
    }, [codCli]);

    if (!sezioni) return null;

    return (
        <Container>
            {/* Desktop: lista visibile direttamente */}
            <div className="it-list-wrapper d-none d-lg-block">
                <h4 className="mb-4">Amministrazione Trasparente</h4>
                <ListaSezioni sezioni={sezioni} codCli={codCli} />
            </div>

            {/* Mobile: lista dentro un accordion */}
            <div className="d-lg-none">
                <Accordion>
                    <AccordionItem>
                        <AccordionHeader
                            active={aperto}
                            onToggle={() => setAperto(!aperto)}
                        >
                            Sezioni
                        </AccordionHeader>
                        <AccordionBody active={aperto}>
                            <ListaSezioni sezioni={sezioni} codCli={codCli} mobile />
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </div>
        </Container>
    );
};

export default Sezioni;
