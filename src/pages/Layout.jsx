import logo from '../assets/logo-repubblica-italiana.svg';
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { Header, HeaderContent, HeaderBrand, Icon, HeaderRightZone, Button, HeaderSearch, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Container, Row, Col, Spinner } from "design-react-kit";
import CookieConsent from "react-cookie-consent";

const Layout = () => {
    // const apiUrl = process.env.REACT_APP_API_URL;
    const apiUrl = 'https://api.myscuola.it';
    const { codCli } = useParams();

    // header
    const [isOpenSearch, toggleModalSearch] = useState(false);
    const [istituto, setIstituto] = useState(null);

    useEffect(() => {
        axios.get(apiUrl + '/api/rest/v1/istituti/anagrafica/' + codCli).then(res => {
            if (res.data.success) setIstituto(res.data.payload);
        });
    }, []);

    // cerca
    const [descrizione, setDescrizione] = useState(null);

    // caricamento
    if (!istituto) return (
        <Container className='my-5'>
            <div className='w-100 d-flex flex-column align-items-center'>
                <Spinner active />
                <p className='fs-4 pt-3'>Caricamento in corso...</p>
            </div>
        </Container>
    );

    return (
        <>
            <Header theme="" type="slim">
                <HeaderContent>
                    <HeaderBrand href={istituto.sitoweb} target='_blank' rel='noopener noreferrer'>
                        <span className='me-2'>Sito web istituzionale</span>
                        <Icon icon="it-external-link" size="sm" />
                    </HeaderBrand>
                    <HeaderRightZone>
                        <div className="it-access-top-wrapper">
                            <Button color="primary" size="sm" href='https://cloud.myscuola.it/' target='_blank' rel='noopener noreferrer'>
                                Accedi
                            </Button>
                        </div>
                    </HeaderRightZone>
                </HeaderContent>
            </Header>

            <Header theme="" type="center">
                <HeaderContent>
                    <HeaderBrand iconAlt="it code circle icon" iconName={logo}>
                        <h2>{istituto.intestazione.toUpperCase()}</h2>
                        <h3>AMMINISTRAZIONE TRASPARENTE</h3>
                    </HeaderBrand>
                    <HeaderRightZone>
                        <HeaderSearch iconName="it-search" label="Cerca" onClick={() => toggleModalSearch(!isOpenSearch)} />
                    </HeaderRightZone>
                </HeaderContent>
            </Header>

            <Modal isOpen={isOpenSearch} toggle={() => toggleModalSearch(!isOpenSearch)} labelledBy='modalRicerca'>
                <ModalHeader toggle={() => toggleModalSearch(!isOpenSearch)} id='modalRicerca'>
                    Cerca
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Input type='text' id='nome-atto' label='Cerca per nome atto' onChange={(e) => setDescrizione(e.target.value)} />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={() => toggleModalSearch(!isOpenSearch)}>
                        Chiudi
                    </Button>
                    <Button color='primary' onClick={() => {
                        toggleModalSearch(!isOpenSearch);
                        console.log(descrizione);
                        // getAtti(isArchivio, null, null, null, null, descrizione);
                    }}>
                        Cerca
                    </Button>
                </ModalFooter>
            </Modal>

            <Outlet />

            <footer className="it-footer">
                <div className="it-footer-main">
                    <Container>
                        <Row>
                            <Col sm='12'>
                                <div className="d-flex align-items-center py-4">
                                    <img height={'67px'} src={logo} alt="Stemma Repubblica Italiana" className='me-3' />
                                    <div className="it-brand-text">
                                        <h4 className='fs-4 m-0 p-0'>{istituto.intestazione.toUpperCase()}</h4>
                                        <h6 className='fs-6 fw-normal m-0 p-0'>AMMINISTRAZIONE TRASPARENTE</h6>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className='py-4 border-white border-top'>
                            <Col lg='4' md='4' className="pb-2">
                                <p>
                                    <strong>Indirizzo</strong><br />
                                    {istituto.indirizzo.toUpperCase()} <br />
                                    {istituto.cap.toUpperCase()} - {istituto.citta.toUpperCase()} ({istituto.prov.toUpperCase()})
                                </p>
                            </Col>
                            <Col lg='4' md='4' className="pb-2">
                                <p>
                                    <strong>Contatti</strong><br />
                                    E-Mail: {istituto.email}<br />
                                    PEC: {istituto.pec}<br />
                                    Telefono: {istituto.telefono}<br />
                                </p>
                            </Col>
                            <Col lg='4' md='4' className="pb-2">
                                <p>
                                    <strong>Statistiche</strong><br />
                                    Numero visite: {1}
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <div className="it-footer-small-prints">
                    <Container className='d-flex justify-space-between'>
                        <ul className="it-footer-small-prints-list list-inline m-0 px-0 d-flex flex-column flex-md-row">
                            <li className="list-inline-item">
                                <a href='https://brcinformatica.it/privacy' target="_blank" rel='noopener noreferrer'>Privacy</a>
                            </li>
                            <li className="list-inline-item">
                                <a href='https://brcinformatica.it/contatti' target="_blank" rel='noopener noreferrer'>Segnalazioni</a>
                            </li>
                            <li className="list-inline-item">
                                <a href='https://brcinformatica.it/' target="_blank" rel='noopener noreferrer'>Crediti</a>
                            </li>
                        </ul>
                    </Container>
                </div>
            </footer>

            <CookieConsent
                location="bottom"
                buttonText="Ok, ho capito!"
                cookieName="brc_wap_cookie"
                style={{ background: "#2B373B" }}
                buttonStyle={{ color: "#fff", backgroundColor: "#0066CC", fontWeight: "bold" }}
                expires={150}
            >
                Questo sito web utilizza alcuni cookie tecnici necessari al funzionamento del software.
                Per più informazioni su quali cookies potrebbero essere utilizzati su questa applicazione clicca <a className='text-white' href='https://brcinformatica.it/privacy' target="_blank" rel='noopener noreferrer'>Leggi di più</a>
            </CookieConsent>
        </>
    )
}

export default Layout;