import React, {useState, useEffect} from "react";
import frFlag from '../assets/fr-flag.png';
import spFlag from '../assets/sp-flag.png';
import jpnFlag from '../assets/jpn-flag.png';

export const Form = ({formInput, setFormInput}) => {

    const radioChangeHandler = (e) => {
        switch (e.target.id) {
            case 'fr':
                setFormInput((prev) => {
                    return {
                        fr: !prev.fr, sp: false, jpn: false
                    };
                });
                break;
            case 'sp':
                setFormInput((prev) => {
                    return {
                        fr: false, sp: !prev.sp, jpn: false
                    };
                });
                break;
            case 'jpn': {
                setFormInput((prev) => {
                    return {
                        fr: false, sp: false, jpn: !prev.jpn
                    }
                })
            }
        }
    }

    return (
        <form>
            <div className="form-el">
                <input type="radio" id="fr" name="lang-form" onChange={(e) => radioChangeHandler(e)}
                       checked={formInput.fr}/>
                <label htmlFor='fr'>French</label>
                <img src={frFlag} alt="french flag" className="flag"/>
            </div>
            <div className="form-el">
                <input type="radio" id="sp" name="lang-form" onChange={(e) => radioChangeHandler(e)}
                       checked={formInput.sp}/>
                <label htmlFor='sp'>Spanish</label>
                <img src={spFlag} alt="spanish flag" className="flag"/>
            </div>
            <div className="form-el">
                <input type="radio" id="jpn" name="lang-form" onChange={(e) => radioChangeHandler(e)}
                       checked={formInput.jpn}/>
                <label htmlFor='jpn'>Japanese</label>
                <img src={jpnFlag} alt="japanese flag" className="flag"/>
            </div>
        </form>
    )
}
