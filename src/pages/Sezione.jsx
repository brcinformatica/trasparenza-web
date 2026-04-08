import {
    Col,
    Container,
    Row,
    Icon,
    Badge,
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionBody,
    Breadcrumb,
    BreadcrumbItem
} from "design-react-kit";
import Sezioni from "../components/Sezioni";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";

const Sezione = () => {
    const apiUrl = "https://api.myscuola.it";
    const { codCli, id } = useParams();

    const [collapseElementOpen, setCollapseElement] = useState("");
    const [sezione, setSezione] = useState(null);
    const [sottosezioni, setSottosezioni] = useState(null);
    const [contenuti, setContenuti] = useState(null);
    const [errore, setErrore] = useState(false);

    useEffect(() => {
        setSezione(null);
        setSottosezioni(null);
        setContenuti(null);
        setErrore(false);

        const fetchData = async () => {
            try {
                const [resSezione, resSottosezioni, resContenuti] = await Promise.all([
                    axios.get(`${apiUrl}/api/rest/v1/amt/sezione/${codCli}/${id}`),
                    axios.get(`${apiUrl}/api/rest/v1/amt/sottosezioni/${codCli}/${id}`),
                    axios.get(`${apiUrl}/api/rest/v1/amt/contenuti/${codCli}/${id}`)
                ]);

                if (resSezione.data.success) setSezione(resSezione.data.payload);
                else setErrore(true);
                if (resSottosezioni.data.success) setSottosezioni(resSottosezioni.data.payload);
                else setSottosezioni([]);
                if (resContenuti.data.success) setContenuti(
                    [...resContenuti.data.payload].sort((a, b) =>
                        new Date(b.data_pubblicazione) - new Date(a.data_pubblicazione)
                    )
                );
                else setContenuti([]);
            } catch (error) {
                console.error("Errore nel caricamento dati:", error);
                setErrore(true);
            }
        };

        fetchData();
    }, [codCli, id]);

    if (errore) return <p>Errore nel caricamento della sezione. Riprovare più tardi.</p>;

    if (!sezione || !sottosezioni || !contenuti)
        return <p>Caricamento in corso...</p>;

    return (
        <Container className="my-4">
            <Breadcrumb>
                <BreadcrumbItem>
                    <Link to={`/${codCli}`}>Amministrazione Trasparente</Link>
                    <span className="separator">/</span>
                </BreadcrumbItem>
                <BreadcrumbItem active>{sezione.etichetta}</BreadcrumbItem>
            </Breadcrumb>

            <Row>
                <Col lg="4">
                    <Sezioni />
                </Col>
                <Col lg="8">
                    <Container>
                        <h1 className="fs-1">{sezione.etichetta}</h1>
                        <p>{sezione.descrizione}</p>

                        <h2 className="fs-3 mt-3">Sottosezioni</h2>
                        <div className="it-list-wrapper">
                            <ul className="it-list border-top">
                                {sottosezioni.map((sottosezione) => (
                                    <li key={sottosezione.id}>
                                        <Link
                                            to={`/${codCli}/sezione/${sottosezione.id}`}
                                            className="list-item"
                                        >
                                            <div className="it-rounded-icon">
                                                <Icon
                                                    color="primary"
                                                    icon="it-folder"
                                                    title="Sezione"
                                                />
                                            </div>

                                            <div className="it-right-zone">
                                                <span className="text">{sottosezione.etichetta}</span>
                                                <Badge color='primary'>{sottosezione.numero_contenuti}</Badge>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <h2 className="fs-3 mt-4">Contenuti</h2>
                        <Accordion>
                            {contenuti.map((contenuto) => {
                                const cleanHtml = DOMPurify.sanitize(contenuto.contenuto);

                                return (
                                    <AccordionItem key={contenuto.id}>
                                        <AccordionHeader
                                            active={collapseElementOpen === contenuto.id}
                                            onToggle={() =>
                                                setCollapseElement(
                                                    collapseElementOpen !== contenuto.id
                                                        ? contenuto.id
                                                        : ""
                                                )
                                            }
                                        >
                                            {contenuto.titolo}
                                        </AccordionHeader>
                                        <AccordionBody
                                            active={collapseElementOpen === contenuto.id}
                                            listClassName="custom-class"
                                        >
                                            <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />

                                            <ul>
                                                <li>
                                                    Pubblicato il <b>{contenuto.data_pubblicazione}</b>
                                                </li>
                                                {contenuto.data_modifica && contenuto.data_modifica !== contenuto.data_pubblicazione && (
                                                    <li>
                                                        Modificato il <b>{contenuto.data_modifica}</b>
                                                    </li>
                                                )}
                                                <li>
                                                    Archiviazione il{" "}
                                                    <b>{contenuto.data_archiviazione}</b>
                                                </li>
                                            </ul>

                                            {contenuto.allegati.length > 0 ? (
                                                <div className="mt-3">
                                                    <b>Allegati:</b>
                                                    <div className="it-list-wrapper">
                                                        <ul className="it-list">
                                                            {contenuto.allegati.map((allegato, index) => (
                                                                <li key={index}>
                                                                    <div className="list-item">
                                                                        <div className="it-rounded-icon">
                                                                            <Icon color="primary" icon="it-file" title="Allegato" />
                                                                        </div>

                                                                        <div className="it-right-zone">
                                                                            <a href={"https://f003.backblazeb2.com/file/trasparenza/" + codCli + "/" + allegato.path} target="_blank" rel="noopener noreferrer" data-focus-mouse="false">
                                                                                <span className="text">{allegato.nome}</span>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </li>

                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p>Nessun allegato disponibile.</p>
                                            )}
                                        </AccordionBody>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default Sezione;
