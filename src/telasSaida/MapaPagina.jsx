import { GoogleMap, useJsApiLoader,DirectionsService,DirectionsRenderer  } from '@react-google-maps/api';
import "./mapaPagina.css"
import { useState } from 'react';
import { useEffect } from 'react';
import Pagina from '../templates/Pagina';

export default function MapaPagina(props){



    
    const [direcoes, setDirecoes] = useState(null);
    const [origem, setOrigem] = useState({ lat: -22.095368, lng:-51.418462});
    const [destino, setDestino] = useState({ lat: -22.105930,lng:-51.443321});
    const [pontosIntermediarios, setPontosIntermediarios] = useState([
        { location: { lat: -22.098633, lng: -51.416408 } },
        { location: { lat: -22.106080, lng: -51.419507 } },
    ]);

    const [carregado,setCarregado] = useState(1)


    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: ""
    })

    const position={
        lat: -22.079105, 
        lng: -51.472569
    }

    const API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
    const API_KEY = '';

    const getApiUrl = (address) => {
        return `${API_URL}?key=${API_KEY}&address=${encodeURI(address)}`;
    }

    

    const address = 'jose medina rodrigues 648';
    

    async function resgatarCoordenadas(endereco){
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                const resultado = data.results[0];
                const coordenadas = resultado.geometry.location;
                const latitude = coordenadas.lat;
                const longitude = coordenadas.lng;
                console.log("Coordenadas:", latitude, longitude);
            } else {
                console.error("Não foi possível obter as coordenadas.");
            }
        })
        .catch(error => console.error("Erro ao obter coordenadas:", error));
    }

    for(const uso of props.enderecos){
        const address = 'José alexandre, 72 - Jardim Pichione, Álvares Machado'
        resgatarCoordenadas(address)
    }
    

    const callbackDirecoes = (resposta) => {
        if (resposta !== null && carregado == 1) {
            if (resposta.status === 'OK') {
                setDirecoes(resposta);
                setCarregado(0)
            } else {
                console.error('Falha na solicitação de direções:', resposta);
            }
        }
    };

    
    
    return (
            <>
                <div className='map'>
                    {
                        isLoaded ? 
                            (
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={origem}
                                zoom={15}
                            >
                                <DirectionsService
                                    options={{
                                        destination: destino,
                                        origin: origem,
                                        waypoints: pontosIntermediarios,
                                        travelMode: 'DRIVING', // Ou o modo de transporte que você deseja
                                    }}
                                    callback={callbackDirecoes}
                                />
                                {direcoes && <DirectionsRenderer directions={direcoes} />}
                            </GoogleMap>
                            ) 
                            : 
                            <></>
                    }
                    <div>

                    </div>
                </div>
            </>
        )

}
