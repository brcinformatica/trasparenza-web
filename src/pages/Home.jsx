import { Col, Container, Row, Breadcrumb, BreadcrumbItem } from "design-react-kit";
import Sezioni from "../components/Sezioni";

const Home = () => {
    return (
        <Container className="my-4">
            <Breadcrumb>
                <BreadcrumbItem active>Amministrazione Trasparente</BreadcrumbItem>
            </Breadcrumb>

            <Row>
                <Col lg="8">
                    <Container>
                        <h1 className="fs-1">Benvenuti</h1>

                        <h4>Cos'è Amministrazione Trasparente?</h4>
                        <p>
                            Il principio della <b>trasparenza</b>, inteso come «accessibilità
                            totale» alle informazioni che riguardano l'organizzazione e
                            l'attività delle pubbliche amministrazioni, è stato affermato con
                            decreto legislativo 14 marzo 2013, n. 33. Obiettivo della norma è
                            quello di favorire un controllo diffuso da parte del cittadino
                            sull'operato delle istituzioni e sull'utilizzo delle risorse
                            pubbliche.
                        </p>
                        <p>In particolare, la pubblicazione dei dati in possesso delle
                            pubbliche amministrazioni intende incentivare la partecipazione
                            dei cittadini per i seguenti scopi:</p>
                        <ul>
                            <li>assicurare la conoscenza dei servizi resi, le
                                caratteristiche quantitative e qualitative, nonché le modalità
                                di erogazione;</li>
                            <li>prevenire fenomeni corruttivi e promuovere l’integrità;</li>
                            <li>sottoporre al controllo diffuso ogni fase del ciclo di
                                gestione della performance per consentirne il miglioramento.</li>
                        </ul>
                        <p>
                            I dati personali pubblicati in questa sezione sono riutilizzabili
                            solo alle condizioni previste dalla normativa vigente sul riuso
                            dei dati pubblici (direttiva comunitaria 2003/98/CE <a href="http://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2006-01-24;36%21vig=" target="_blank">e d. lgs. 36/2006</a> di recepimento della
                            stessa), in termini compatibili con gli scopi per i quali sono
                            stati raccolti e registrati, e nel rispetto della normativa in
                            materia di protezione dei dati personali
                        </p>

                        <h4>Riferimenti Normativi</h4>
                        <ul>
                            <li><a href="http://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2012-11-06;190!vig=2013-10-25" target="_blank">Legge 6 novembre 2012 , n. 190 -
                                Disposizioni per la prevenzione e la repressione della
                                corruzione e dell'illegalità nella pubblica amministrazione</a></li>
                            <li><a href="http://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2013-03-14;33!vig=" target="_blank">Decreto legislativo 14 marzo 2013, n. 33</a></li>
                            <li><a href="https://www.anticorruzione.it/portal/rest/jcr/repository/collaboration/Digital%20Assets/anacdocs/Attivita/Atti/Delibere/2013/50/Delibera-n.-50_2013-formato-PDF-scansionato-449-Kb.pdf" target="_blank">Delibera CIVIT n.50/2013</a></li>
                            <li><a href="https://www.anticorruzione.it/-/determinazione-n.-430-del-13/04/2016-rif.-1" target="_blank">Delibera ANAC n. 430/2016</a></li>
                        </ul>
                    </Container>
                </Col>
                <Col lg="4">
                    <Sezioni />
                </Col>
            </Row>
        </Container>
    )
}

export default Home;