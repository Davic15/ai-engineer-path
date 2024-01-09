import React from 'react'
import backgroundImage from '../assets/worldmap.png'
import parrot from '../assets/parrot.png';
export const Header = () => {
    return (
        <section className='header'>
            <div className="header-container">
                <img src={backgroundImage} alt="world map" className="header-img"/>
                <div className="header-title-container">
                    <img src={parrot} alt="parrot" className="header-title-img"/>
                    <div className="header-title">
                        <h1>PollyGlot</h1>
                        <p>Perfect translation every time</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
