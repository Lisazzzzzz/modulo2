import React, { useState } from "react";
import './style.css';
import botaolupa from "../images/headerimage/lupa.png"; 
import Card from "./card";

const Main = () => {
    const [showInput, setShowInput] = useState(false); 

    const handleButtonClick = (event) => {
        event.preventDefault(); 
        setShowInput(!showInput); 
    };

    return (
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
                        {showInput && ( 
                            <input 
                                type="text" 
                                placeholder="Coloca o nome do filme" 
                                className="inputText"
    
                            />
                        )}
                        <button 
                            className="image-button" 
                            onClick={handleButtonClick}
                        >
                            <img 
                                src={botaolupa} 
                                alt="Botão com imagem" 
                                className="button-image" 
                            />
                        </button>
                    </div>
                </form>
            </div>
            <div className="container">
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                </div>
        </>
    );
}

export default Main;
