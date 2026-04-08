import {
    Col,
    Container,
    Row,
    Icon,
    Badge,
    Button,
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionBody,
    Breadcrumb,
    BreadcrumbItem
} from "design-react-kit";
import Sezioni from "../components/Sezioni";
import { Link, useParams, useLocation, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import DOMPurify from "dompurify";

const PER_PAGINA = 10;

const Sezione = () => {
    const apiUrl = "https://api.myscuola.it";
    const { codCli, id } = useParams();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const pagina = parseInt(searchParams.get('pagina') || '1', 10);

    const [collapseElementOpen, setCollapseElement] = useState("");
    const [sezione, setSezione] = useState(null);
    const [sottosezioni, setSottosezioni] = useState(null);
    const [contenuti, setContenuti] = useState(null);
    const [paginazione, setPaginazione] = useState(null);
    const [errore, setErrore] = useState(false);
    const [linkCopiato, setLinkCopiato] = useState(null);
    const hasScrolled = useRef(false);
    const contenutiRef = useRef(null);

    // Carica sezione e sottosezioni solo quando cambia la sezione
    useEffect(() => {
        setSezione(null);
        setSottosezioni(null);
        setErrore(false);

        const fetchStruttura = async () => {
            try {
                const [resSezione, resSottosezioni] = await Promise.all([
                    axios.get(`${apiUrl}/api/rest/v1/amt/sezione/${codCli}/${id}`),
                    axios.get(`${apiUrl}/api/rest/v1/amt/sottosezioni/${codCli}/${id}`)
                ]);
                if (resSezione.data.success) setSezione(resSezione.data.payload);
                else setErrore(true);
                if (resSottosezioni.data.success) setSottosezioni(resSottosezioni.data.payload);
                else setSottosezioni([]);
            } catch {
                setErrore(true);
            }
        };

        fetchStruttura();
    }, [codCli, id]);

    // Carica contenuti quando cambia sezione o pagina
    useEffect(() => {
        setContenuti(null);
        setCollapseElement("");
        hasScrolled.current = false;

        const fetchContenuti = async () => {
            try {
                const res = await axios.get(
                    `${apiUrl}/api/rest/v1/amt/contenuti/${codCli}/${id}?pagina=${pagina}&per_pagina=${PER_PAGINA}`
                );
                if (res.data.success) {
                    setContenuti(res.data.payload);
                    setPaginazione(res.data.paginazione);
                } else {
                    setContenuti([]);
                    setPaginazione(null);
                }
            } catch {
                setContenuti([]);
                setPaginazione(null);
            }
        };

        fetchContenuti();
    }, [codCli, id, pagina]);

    // Apri e scrolla al contenuto se c'è un hash nell'URL
    useEffect(() => {
        if (!contenuti || hasScrolled.current) return;
        const hash = location.hash;
        if (!hash.startsWith('#contenuto-')) return;
        const contenutoId = parseInt(hash.replace('#contenuto-', ''), 10);
        if (!contenutoId) return;
        const esiste = contenuti.some(c => c.id === contenutoId);
        if (!esiste) return;

        hasScrolled.current = true;
        setCollapseElement(contenutoId);
        setTimeout(() => {
            const el = document.getElementById(`contenuto-${contenutoId}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }, [contenuti, location.hash]);

    const cambiaPagina = (nuovaPagina) => {
        setSearchParams({ pagina: nuovaPagina });
        setTimeout(() => {
            if (contenutiRef.current)
                contenutiRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    };

    const copiaLink = (contenutoId) => {
        const url = `${window.location.origin}${window.location.pathname}?pagina=${pagina}#contenuto-${contenutoId}`;
        navigator.clipboard.writeText(url).then(() => {
            setLinkCopiato(contenutoId);
            setTimeout(() => setLinkCopiato(null), 2000);
        });
    };

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

                        {sottosezioni.length > 0 && (
                            <>
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
                            </>
                        )}

                        <h2 className="fs-3 mt-4" ref={contenutiRef}>Contenuti</h2>

                        {paginazione && paginazione.totale > 0 && (
                            <p className="text-muted mb-3">
                                {paginazione.totale} contenut{paginazione.totale === 1 ? 'o' : 'i'} —
                                pagina {paginazione.pagina} di {paginazione.pagine}
                            </p>
                        )}

                        <Accordion>
                            {contenuti.map((contenuto) => {
                                const cleanHtml = DOMPurify.sanitize(contenuto.contenuto);

                                return (
                                    <AccordionItem key={contenuto.id} id={`contenuto-${contenuto.id}`}>
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
                                                    Archiviazione il <b>{contenuto.data_archiviazione}</b>
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

                                            <div className="mt-3">
                                                <Button
                                                    color='secondary'
                                                    size='sm'
                                                    outline
                                                    onClick={() => copiaLink(contenuto.id)}
                                                    icon
                                                >
                                                    <Icon icon={linkCopiato === contenuto.id ? 'it-check' : 'it-link'} size='sm' />
                                                    {linkCopiato === contenuto.id ? 'Link copiato!' : 'Copia link'}
                                                </Button>
                                            </div>
                                        </AccordionBody>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>

                        {paginazione && paginazione.pagine > 1 && (
                            <nav className="mt-4" aria-label="Paginazione contenuti">
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${pagina === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => cambiaPagina(pagina - 1)} disabled={pagina === 1}>
                                            <Icon icon="it-chevron-left" size="sm" />
                                            <span className="visually-hidden">Precedente</span>
                                        </button>
                                    </li>

                                    {Array.from({ length: paginazione.pagine }, (_, i) => i + 1).map((p) => (
                                        <li key={p} className={`page-item ${p === pagina ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => cambiaPagina(p)}>
                                                {p}
                                            </button>
                                        </li>
                                    ))}

                                    <li className={`page-item ${pagina === paginazione.pagine ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => cambiaPagina(pagina + 1)} disabled={pagina === paginazione.pagine}>
                                            <Icon icon="it-chevron-right" size="sm" />
                                            <span className="visually-hidden">Successiva</span>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}

                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default Sezione;
