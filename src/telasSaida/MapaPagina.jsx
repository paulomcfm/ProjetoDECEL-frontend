import { GoogleMap, useJsApiLoader,DirectionsService,DirectionsRenderer  } from '@react-google-maps/api';
import "./mapaPagina.css"
import { useState } from 'react';
import { useEffect } from 'react';
import Pagina from '../templates/Pagina';

export default function MapaPagina(props){
    
    console.log(props.enderecos)
    const [direcoes, setDirecoes] = useState(null);
    const [origem, setOrigem] = useState({lat:props.enderecos.origem[0].location.lat,lng:props.enderecos.origem[0].location.lng});
    const [destino, setDestino] = useState({lat:props.enderecos.destino[0].location.lat,lng:props.enderecos.destino[0].location.lng});
    const [pontosIntermediarios, setPontosIntermediarios] = useState(props.enderecos.listaIntermed);
    console.log(pontosIntermediarios)
    const lista = []
    
    

    
    
    const [carregado,setCarregado] = useState(1)
    
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyCKNlqqhmlCYU7bLjeku8uWsDfxOxDM5R8"
    })
    
    

    const API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
    const API_KEY = 'AIzaSyCKNlqqhmlCYU7bLjeku8uWsDfxOxDM5R8';

    const getApiUrl = (address) => {
        return `${API_URL}?key=${API_KEY}&address=${encodeURI(address)}`;
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
