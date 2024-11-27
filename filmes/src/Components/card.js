import react from "react";
import capa from "../images/headerimage/capa.jpg"; 
import './style.css';

const Card = ()=>{
    return(
        <>
            <div className="movie">
                <img src={capa} 
                     alt="Imagem" 
                     className="capa-filme" > 
                </img>
                <div className="movie-detalhes">
                    <h4 className="title"> Título do filme </h4>
                    <p className="rating"> 9.7 </p>
                </div>
                <div className="overview"> 
                    <h1> overview </h1>
                    O gato roeu a rolha da garrafa do rei da russia
                </div>
            </div>
        </>
    )
}

export default Card