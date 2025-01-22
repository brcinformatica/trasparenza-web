import { Col, Container, Row, Icon, Accordion, AccordionItem, AccordionHeader, AccordionBody, Breadcrumb, BreadcrumbItem } from "design-react-kit";
import Sezioni from "../components/Sezioni";
import { Link, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Sezione = () => {
    // const apiUrl = process.env.REACT_APP_API_URL;
    const apiUrl = 'https://api.brcnet.it';
    const { codCli, id } = useParams();

    const [collapseElementOpen, setCollapseElement] = useState('');

    // header
    const [sezione, setSezione] = useState(null);
    const [sottosezioni, setSottosezioni] = useState(null);
    const [contenuti, setContenuti] = useState(null);

    useEffect(() => {
        axios.get(apiUrl + '/api/rest/v1/amt/sezione/' + codCli + '/' + id).then(res => {
            if (res.data.success) setSezione(res.data.payload);
        });

        axios.get(apiUrl + '/api/rest/v1/amt/sottosezioni/' + codCli + '/' + id).then(res => {
            if (res.data.success) setSottosezioni(res.data.payload);
        });

        axios.get(apiUrl + '/api/rest/v1/amt/contenuti/' + codCli + '/' + id).then(res => {
            if (res.data.success) setContenuti(res.data.payload);
        });
    }, [id]);

    if (!sezione || !sottosezioni || !contenuti) return (
        <p>Caricamento in corso...</p>
    );

    return (
        <Container className="my-4">
            <Breadcrumb>
                <BreadcrumbItem>
                    <Link to={'/' + codCli}>Amministrazione Trasparente</Link>
                    <span className='separator'>/</span>
                </BreadcrumbItem>
                <BreadcrumbItem active>{sezione.etichetta}</BreadcrumbItem>
            </Breadcrumb>

            <Row>
                <Col lg="8">
                    <Container>
                        <h1 className="fs-1">{sezione.etichetta}</h1>
                        <p>{sezione.descrizione}</p>

                        <h2 className="fs-3 mt-3">Sottosezioni</h2>
                        <div className="it-list-wrapper">
                            <ul className="it-list border-top">
                                {sottosezioni.map((sottosezione, index) => {
                                    return (
                                        <li key={index}>
                                            <Link to={'/' + codCli + '/sezione/' + sottosezione.id} className="list-item">
                                                <div className="it-rounded-icon">
                                                    <Icon color="primary" icon="it-folder" title="Sezione" />
                                                </div>

                                                <div className="it-right-zone">
                                                    <span className="text">{sottosezione.etichetta}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        <h2 className="fs-3 mt-4">Contenuti</h2>
                        <Accordion>
                            {contenuti.map((contenuto, index) => {
                                return (
                                    <AccordionItem key={index}>
                                        <AccordionHeader
                                            active={collapseElementOpen === contenuto.id}
                                            onToggle={() => setCollapseElement(collapseElementOpen !== contenuto.id ? contenuto.id : '')}
                                        >
                                            {/* <Icon className="me-2" color="primary" icon="it-file" title="Contenuto" /> */}
                                            {contenuto.titolo}
                                        </AccordionHeader>
                                        <AccordionBody active={collapseElementOpen === contenuto.id} listClassName={'custom-class'}>
                                            <p>{contenuto.contenuto}</p>

                                            <ul>
                                                <li>Pubblicato il <b>{contenuto.data_pubblicazione}</b></li>
                                                <li>Modificato il <b>{contenuto.data_modifica || contenuto.data_pubblicazione}</b></li>
                                                <li>Archiviazione il <b>{contenuto.data_archiviazione}</b></li>
                                            </ul>

                                            {(contenuto.allegati).length > 0 ? (
                                                <div className="mt-3">
                                                    <b>Allegati:</b>
                                                    <div className="it-list-wrapper">
                                                        <ul className="it-list">
                                                            {contenuto.allegati.map((allegato, index) => {
                                                                return (
                                                                    <li key={index}>
                                                                        <div className="list-item">
                                                                            <div className="it-rounded-icon">
                                                                                <Icon color="primary" icon="it-file" title="Allegato" />
                                                                            </div>

                                                                            <div class="it-right-zone">
                                                                                <a href={"https://cdn.myscuola.it/file/trasparenza/" + codCli + "/" + allegato.path} target="_blank" class="" data-focus-mouse="false">
                                                                                    <span class="text">{allegato.nome}</span>
                                                                                </a>

                                                                                {/* <span class="it-multiple">
                                                                                    <a href="javascript:showlistversion(1);" aria-label="Versioni del file" class="" data-focus-mouse="false">
                                                                                        <svg class="icon" data-bs-toggle="tooltip" title="Versioni">
                                                                                            <use href="/assets/bootstrap-italia/svg/sprites.svg#it-restore"></use>
                                                                                        </svg>

                                                                                        1                                                                                </a>

                                                                                    <a href="javascript:showpermalink('3d9312e7-3665-47c6-ad23-cdcea4c1cdf6', 2);" aria-label="Permalink">
                                                                                        <svg class="icon" data-bs-toggle="tooltip" title="Permalink">
                                                                                            <use href="/assets/bootstrap-italia/svg/sprites.svg#it-link"></use>
                                                                                        </svg>
                                                                                    </a>
                                                                                </span> */}
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p>Nessun allegato disponibile.</p>
                                            )}
                                        </AccordionBody>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    </Container>
                </Col>
                <Col lg="4">
                    <Sezioni />
                </Col>
            </Row>
        </Container>
    )
}

export default Sezione;