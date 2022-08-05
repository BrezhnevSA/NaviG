import { string } from 'prop-types';
import React, {useEffect} from 'react';
import LocalizedStrings from 'react-localization';
import "./ReleaseNotes.css";

let strings = new LocalizedStrings({
    en: {
        pageTitle: "Release Notes",
        comingSoon: "Comning soon"
    },
    ru: {
        pageTitle: "Примечания к релизу",
        comingSoon: "Скоро"
    },
    de: {
        pageTitle: "Versionshinweise",
        comingSoon: "Kommt bald"
    }
});

const ReleaseNotes = () => {
    let lang = localStorage.getItem('lang').toLowerCase();
    strings.setLanguage(localStorage.getItem('lang').toLowerCase());

    useEffect(() => {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }, [lang])

    return (
        <div className="container-fluid overflow-auto with-actions">
            <div className="container page-title-wrapper" >
                <h1 id="page-title">{ strings.pageTitle }</h1>
            </div>
            <div className="release-notes-content">
                {strings.comingSoon}
            </div>
        </div>
    );
}

export default (ReleaseNotes);