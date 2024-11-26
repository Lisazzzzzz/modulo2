import react from "react";
import './style.css'
import botaolupa from "../images/headerimage/lupa.png"; 

const Main =()=>{
    return(
        <> 
            <div className="header">
                <nav>
                    <ul>
                        <li>
                            <a href="#"> Comédia </a>
                        </li>
                        <li>
                            <a href="#"> Romance </a>
                        </li>
                        <li>
                            <a href="#"> Popular </a>
                        </li>
                        <li>
                            <a href="#"> Drama </a>
                        </li>
                        <li>
                            <a href="#"> Teatro </a>
                        </li>
                    </ul>
                </nav>
                <form>
                    <div className="search-btn"> 
                        <input type="text" placeholder="Coloca o nome do filme" className="inputText">
                        
                        </input>
                        <button> <img src={botaolupa} alt="Botão com imagem" className="button-image" /> </button>
                    </div>
                </form>
            </div>
        
        </>
    )
}

export default Main;