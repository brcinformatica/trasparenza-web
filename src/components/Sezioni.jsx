import { Container } from "design-react-kit";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Icon, Badge } from "design-react-kit";

const Sezioni = () => {
    // const apiUrl = process.env.REACT_APP_API_URL;
    const apiUrl = 'https://api.myscuola.it';
    const { codCli } = useParams();

    // header
    const [sezioni, setSezioni] = useState(null);

    useEffect(() => {
        axios.get(apiUrl + '/api/rest/v1/amt/sezioni/' + codCli).then(res => {
            if (res.data.success) setSezioni(res.data.payload);
        });
    }, []);

    if (!sezioni) return null;

    return (
        <Container>
            <div className="it-list-wrapper">
                <h4 className="mb-4">Amministrazione Trasparente</h4>
                <ul className="it-list border-top">
                    {sezioni.map((sezione, index) => {
                        return (
                            <li key={index}>
                                <Link to={'/' + codCli + '/sezione/' + sezione.id} className="list-item">
                                    <Icon className="it-rounded-icon" color="primary" icon="it-folder" title="Sezione" />
                                    <div className="it-right-zone">
                                        <span className="text">{sezione.etichetta}</span>
                                        <Badge color='primary'>{sezione.numero_contenuti}</Badge>
                                    </div>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </Container>
    )
}

export default Sezioni;