import React, { Component } from 'react';
import { connect } from "react-redux";
import * as rbac from '../../../rbac/rbac';
import * as rights from '../../../constants/Rights';

import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en:{
        comingsoon: "Coming soon",
        faq: "FAQ"
    },
    ru: {
        comingsoon: "Скоро появится",
        faq: "FAQ"
    },
    de: {
        comingsoon: "Kommt bald",
        faq: "FAQ"
    }
});

class Faq extends Component {

    constructor(props) {
        super(props);
        
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());  
    }

    componentWillReceiveProps(nextProps) {
        strings.setLanguage(localStorage.getItem('lang').toLowerCase());
    }

    render() {
        const { user } = this.props;
        return (
            <>
                <div className="container-fluid overflow-auto with-actions">
                    <div className="container page-title-wrapper" >
                        <h1 id="page-title">{ strings.faq }</h1>
                    </div>
                    <div className="faq-content">
                        <h2 style={{marginTop: "-20px"}}>Оглавление</h2>
                        <ul style={{listStyleType: "none", marginLeft: "-35px"}}>
                            <li><a href="#1_auth">1 Авторизация</a></li>
                            <li>
                                <ul style={{listStyleType: "none"}}>
                                    <li><a href="#1_1_auth">Windows</a></li>
                                    <li><a href="#1_2_auth">EMEA2</a></li>
                                </ul>
                            </li>
                            <li><a href="#2_home">2 Домашняя страница</a></li>
                            <li>
                                <ul style={{listStyleType: "none"}}>
                                    <li><a href="#2_1_home">2.1 План этажа </a></li>
                                    <li><a href="#2_2_home">2.2 Информация о сотруднике</a></li>
                                </ul>
                            </li>
                            <li><a href="#3_search">3 Поиск</a></li>
                            <li><a href="#4_sd">4 Shared desk </a></li>
                            <li>
                                <ul style={{listStyleType: "none"}}>
                                    <li><a href="#4_1_sd">4.1 Правила бронирований</a></li>
                                    <li><a href="#4_2_sd">4.2 Раздел "Бронирования"</a></li>
                                    <li>
                                        <ul style={{listStyleType: "none"}}>
                                            <li><a href="#4_2_1_sd">Создание бронирования</a></li>
                                            <li><a href="#4_2_2_sd">Редактирование бронирования</a></li>
                                            <li><a href="#4_2_3_sd">Удаление бронирования</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="#4_3_sd">4.3 Как забронировать с карты </a></li>
                                    <li><a href="#4_4_sd">4.4 Как забронировать через чатбот </a></li>
                                    <li>
                                        <ul style={{listStyleType: "none"}}>
                                            <li><a href="#4_4_1_sd">Создание бронирования</a></li>
                                            <li><a href="#4_4_2_sd">Редактирование бронирвоания</a></li>
                                            <li><a href="#4_4_3_sd">Удаление бронирования</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li><a href="#5_additional">5 Дополнительные возможности </a></li>
                            { user && user.loggingIn && user.user && user.user.rights && 
                              rbac.isSatisfied([rights.DELETE_AVAILABLE_DATES_FOR_PARKING], user.user.rights)
                                ? <li><a href="#6_parking">6 Открытие парковочного места для коллег Владельцем  парковочного места</a></li>
                                : <></>
                            }
                            { user && user.loggingIn && user.user && user.user.rights && 
                              rbac.isSatisfied([rights.DELETE_AVAILABLE_DATES_FOR_PARKING], user.user.rights)
                                ? <li>
                                    <ul style={{listStyleType: "none"}}>
                                        <li><a href="#6_1_parking">Открытие дат </a></li>
                                        <li><a href="#6_2_parking">Добавление коллег </a></li>
                                        <li><a href="#6_3_parking">Бронирование парковочного места </a></li>
                                    </ul>
                                 </li>
                                : <></>
                            }
                        </ul>

                        <h2 id="1_auth">1&nbsp;Авторизация&nbsp;</h2>
                        
                        <p><span style={{color: "rgb(56,56,56)"}}>Авторизация в системе доступна двумя способами: по Windows и EMEA2 аккаунтам.</span></p>
                        
                        <h3 id="1_1_auth"><span style={{color: "rgb(56,56,56)"}}>Windows</span></h3>
                        
                        <p><span style={{color: "rgb(56,56,56)"}}>Для авторизации в системе достаточно ввести свой доменный аккаунт и пароль.</span></p>
                        <p><span style={{color: "rgb(56,56,56)"}}><img className="confluence-embedded-image" height="250" src={`/files/image2021-5-17_9-29-22.png?${Math.random()}`} data-image-src="/files/image2021-5-17_9-29-22.png?version=1&amp;modificationDate=1621232962117&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532451" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_9-29-22.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_9-29-22.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_9-29-22.png" data-image-height="340" data-image-width="443"/></span></p>
                        
                        <h3 id="1_2_auth"><span style={{color: "rgb(56,56,56)"}}>EMEA2</span></h3>
                        
                        <p><span style={{color: "rgb(56,56,56)"}}>Введите вашу почту и ЕМЕА2 пароль.</span></p>
                        <h2 id="2_home">2 Домашняя страница</h2>
                        <p>На домашней странице T-Navi для пользователя доступны следующие возможности:&nbsp;</p>
                        <ul>
                            <li>открытие плана этажа (выбор города → БЦ→корпус →этаж)</li>
                            <li>поиск&nbsp;</li>
                            <li>переключение языковой раскладки</li>
                            <li>меню профиля</li>
                            <li>FAQ, обратная связь&nbsp;</li>
                        </ul>
                        
                        <h3 id="2_1_home">2.1 План этажа&nbsp;</h3>
                        
                        <p>План<span>&nbsp;</span><strong>этажа</strong><span>&nbsp;</span>представляет собой схематичное изображение одного этажа с набором объектов.</p>
                        <p>Для того чтобы открыть план этажа на главной странице нужно выбрать город → БЦ→корпус →этаж.</p>
                        <p><img className="confluence-embedded-image" height="250" src={`/files/image2021-5-17_9-52-7.png?${Math.random()}`} data-image-src="/files/image2021-5-17_9-52-7.png?version=1&amp;modificationDate=1621234327889&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532470" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_9-52-7.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_9-52-7.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_9-52-7.png" data-image-height="649" data-image-width="1388"/></p>
                        <p><em>Примечание:&nbsp; карту можно масштабировать (увеличивать/уменьшать)&nbsp;<span style={{color: "rgb(77,81,86)"}}>при прокрутке<span>&nbsp;</span></span><em style={{textAlign: "left"}}>колёсика мыши</em></em></p>
                        
                        <h4>Краткий перечень условных обозначений на карте</h4>
                        
                        <p><em>SEB32RAS</em> - унифицированное условное обозначение наименования, где S - наименование города (Санкт-Петербург),&nbsp;<em>E - </em>наименование БЦ <em>(Елизаветинский),&nbsp;&nbsp;B3 - </em>наименование корпуса,&nbsp;<em>2R - </em>наименование этажа<em> (2 этаж правое крыло),&nbsp;AS - </em>номер стола в помещении на этаже. Аналогично устроены наименования других объектов на карте.&nbsp;</p>
                        <p><img className="confluence-embedded-image confluence-thumbnail" height="60" src={`/files/image2021-5-17_10-2-9.png?${Math.random()}`} data-image-src="/files/image2021-5-17_10-2-9.png?version=1&amp;modificationDate=1621234929371&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532482" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_10-2-9.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_10-2-9.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_10-2-9.png" data-image-height="60" data-image-width="67"/>&nbsp;- условное обозначение рабочего стола, зафиксированного за сотрудником&nbsp;</p>
                        <p><br></br></p>
                        <p><img className="confluence-embedded-image confluence-thumbnail" height="60" src={`/files/image2021-5-17_9-56-0.png?${Math.random()}`} data-image-src="/files/image2021-5-17_9-56-0.png?version=1&amp;modificationDate=1621234560084&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532473" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_9-56-0.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_9-56-0.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_9-56-0.png" data-image-height="60" data-image-width="75"/>&nbsp;- условное обозначение стола, зарезервированного на МВЗ&nbsp;</p>
                        <p><br></br></p>
                        <p><img className="confluence-embedded-image confluence-thumbnail" height="62" src={`/files/image2021-5-17_10-6-4.png?${Math.random()}`} data-image-src="/files/image2021-5-17_10-6-4.png?version=1&amp;modificationDate=1621235164669&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532484" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_10-6-4.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_10-6-4.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_10-6-4.png" data-image-height="62" data-image-width="64"/>&nbsp;-&nbsp;условное обозначение необорудованного shared desk места</p>
                        <p><br></br></p>
                        <p><img className="confluence-embedded-image confluence-thumbnail" height="62" src={`/files/image2021-5-17_10-0-32.png?${Math.random()}`} data-image-src="/files/image2021-5-17_10-0-32.png?version=1&amp;modificationDate=1621234832481&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532481" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_10-0-32.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_10-0-32.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_10-0-32.png" data-image-height="62" data-image-width="69"/>&nbsp;-&nbsp;условное обозначение оборудованного shared desk места, <strong>доступного</strong> для бронирования</p>
                        <p><br></br></p>
                        
                        <p><img className="confluence-embedded-image confluence-thumbnail" height="35" src={`/files/image2021-5-18_13-36-15.png?${Math.random()}`} data-image-src="/files/image2021-5-18_13-36-15.png?version=1&amp;modificationDate=1621334174827&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532679" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-18_13-36-15.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-18_13-36-15.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-18_13-36-15.png" data-image-height="35" data-image-width="53"/>&nbsp;-&nbsp;условное обозначение небезопасного стола (место, на котором не предусмотрена работа сотрудника)</p>
                        <h3 id="2_2_home">2.2 Информация о сотруднике&nbsp; &nbsp;</h3>
                        
                        <p>На плане этажа доступна возможность просмотра информации о сотруднике:</p>
                        <ul>
                            <li>Фото (если загружено).&nbsp;</li>
                            <li>Имя, фамиля.&nbsp;При нажатии на <strong>Имя, Фамилию</strong> сотрудника - осуществляется переход на страницу профиля пользователя&nbsp;</li>
                            <li>Возможность открытия диалога в Webex&nbsp;</li>
                            <li>Возможность копирования адреса электронной почты</li>
                            <li>Проект.&nbsp;При нажатии на наименование проекта -&nbsp;осуществляется переход&nbsp;на страницу сотрудников проекта</li>
                            <li>МВЗ.&nbsp;При нажатии на МВЗ - осуществляется переход на страницу сотрудников МВЗ</li>
                            <li>Формат работы</li>
                            <li>Возможность копирования наименования рабочего места&nbsp;</li>
                        </ul>
                        <p><img className="confluence-embedded-image" height="250" src={`/files/image2021-5-17_10-16-50.png?${Math.random()}`} data-image-src="/files/image2021-5-17_10-16-50.png?version=1&amp;modificationDate=1621235810867&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532487" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_10-16-50.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_10-16-50.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_10-16-50.png" data-image-height="659" data-image-width="1246"/></p>
                        <p><br></br></p>
                        
                        <h2 id="3_search">3 Поиск</h2>
                        
                        <p>Поиск работает медленно, но верно. Не торопитесь!&nbsp;</p>
                        <p>В системе для пользователя реализована возможность поиска:&nbsp;</p>
                        <ul>
                            <li>сотрудника (по имени и (или) фамилии)</li>
                            <li>наименования помещения (переговорка, опен спейс, кухня)</li>
                            <li>наименования стола&nbsp;</li>
                            <li>наименования проекта</li>
                            <li>наименования МВЗ</li>
                            <li>наименования объекта на карте (если оно задано администратором)</li>
                        </ul>
                        <p><img className="confluence-embedded-image" height="400" src={`/files/image2021-5-17_10-56-31.png?${Math.random()}`} data-image-src="/files/image2021-5-17_10-56-31.png?version=1&amp;modificationDate=1621238191147&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532499" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_10-56-31.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_10-56-31.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_10-56-31.png" data-image-height="623" data-image-width="1731"/></p>
                        <p><img className="confluence-embedded-image" height="250" src={`/files/Animation.gif?${Math.random()}`} data-image-src="/files/Animation.gif?version=1&amp;modificationDate=1621239475152&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532512" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="Animation.gif" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/gif" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; Animation.gif" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; Animation.gif" data-image-height="584" data-image-width="1110"/></p>
                        
                        <h2 id="4_sd">4 Shared desk&nbsp;</h2>
                        
                        <h3 id="4_1_sd">4.1 Правила бронирований</h3>
                        
                        <ol>
                            <li>Все shared desk места закреплены за верхнеуровневыми кост центрами (МВЗ, место возникновения затрат) Deutsche Telekom и Growth Portfolio/T-Systems.&nbsp; Бронирования осуществляются в рамках принадлежности сотрудника к нижестоящим МВЗ&nbsp;Deutsche Telekom и Growth Portfolio соответственно.</li>
                            <li>Для любых действий с бронирвоаниями в интерфейсе T-Navi необходимо <strong>АВТОРИЗОВАТЬСЯ</strong> в системе.&nbsp; Для действий в чатботе - автризация не требуется.&nbsp;</li>
                            <li>Каждый сотрудник может создать 1 бронирование на 1 дату на 1 место.&nbsp;</li>
                            <li>Срок 1 бронирования -&nbsp; от <strong>1 до&nbsp;5 дней</strong> с текущей даты.</li>
                            <li>Сотрудник <strong>с фиксированным местом в офисе</strong>&nbsp; может создать 1 бронирование на текущую (или на другую) дату <strong>в другом БЦ</strong>, в другом городе. В своем БЦ (где расположено фиксированное рабочее место) сотрудник сделать бронирование не может.&nbsp;</li>
                            <li>Если при попытке создания бронирования с карты вы встречаете сообщение "Вы не можете забронировать данное место..." :&nbsp;&nbsp;</li>
                        </ol>
                        <ul>
                            <li>проверьте авторизованы ли вы в системе</li>
                            <li>вы пытаетесь забронировать место другого МВЗ&nbsp;</li>
                            <li>вы сотрудник с фиксированным рабочим местом и пытаетесь забронировать место в своем БЦ&nbsp;</li>
                        </ul>
                        
                        <h3 id="4_2_sd">4.2 Раздел "Бронирования"</h3>
                        
                        <h4 id="4_2_1_sd">Создание бронирования</h4>
                        
                        <ol>
                            <li>В боковом меню выбрать раздел "Бронирования", нажать на пункт меню "Забронировать"<br></br>&nbsp;<img className="confluence-embedded-image" height="241" src={`/files/image2021-5-17_11-52-40.png?${Math.random()}`} data-image-src="/files/image2021-5-17_11-52-40.png?version=1&amp;modificationDate=1621241560573&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532519" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_11-52-40.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_11-52-40.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_11-52-40.png" data-image-height="241" data-image-width="372"/></li>
                            <li>В разделе "Бронирования" на вклдаке "Забронировать" заполнить поля - выбрать период бронирования, выбрать БЦ, корпус (если необходимо). Нажать на кнопку "Найти".<br></br><img className="confluence-embedded-image" height="250" src={`/files/image2021-5-17_11-58-41.png?${Math.random()}`} data-image-src="/files/image2021-5-17_11-58-41.png?version=1&amp;modificationDate=1621241921784&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532521" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_11-58-41.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_11-58-41.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_11-58-41.png" data-image-height="462" data-image-width="942"/><strong><br></br><br></br></strong></li>
                            <li>Выберите интересующее место. При клике на место - откроется предпросмотр места на этаже.&nbsp;<br></br><strong><img className="confluence-embedded-image" height="250" src={`/files/image2021-5-17_12-30-50.png?${Math.random()}`} data-image-src="/files/image2021-5-17_12-30-50.png?version=1&amp;modificationDate=1621243850557&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532526" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_12-30-50.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_12-30-50.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_12-30-50.png" data-image-height="760" data-image-width="940"/><br></br>Примчание: </strong><em>в&nbsp;результате поиска будет выведено сообщение "У вас уже есть бронирование на выбранную дату", если у вас уже есть текущее бронирование на выбранную дату. Дождитесь окончания текущего бронировоания или удалите&nbsp; имеющееся бронирование и попробуйте снова.</em></li>
                            <li>Подтвердите бронирование.&nbsp;<br></br><br></br></li>
                            <li>Бронирование создано. На почту поступит оповещение о создании бронирования. Просмотреть все бронирования можно на вкладке "Мои бронирования"<br></br><img className="confluence-embedded-image" height="250" src={`/files/image2021-5-17_12-41-4.png?${Math.random()}`} data-image-src="/files/image2021-5-17_12-41-4.png?version=1&amp;modificationDate=1621244464540&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532530" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_12-41-4.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_12-41-4.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_12-41-4.png" data-image-height="551" data-image-width="1820"/></li>
                        
                        </ol>
                        
                        <h4 id="4_2_2_sd">Редактирование бронирования</h4>
                        
                        <p>У пользователя есть возможность изменить дату бронирования, место бронирования.&nbsp;</p>
                        <ol>
                            <li>В разделе бронирования откройте вкладку "Мои бронирования". Выберите бронирование, которое хотите изменить и нажмите на иконку редактирования&nbsp;<img className="confluence-embedded-image confluence-thumbnail" height="40" src={`/files/image2021-5-17_12-43-18.png?${Math.random()}`} data-image-src="/files/image2021-5-17_12-43-18.png?version=1&amp;modificationDate=1621244598096&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532531" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_12-43-18.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_12-43-18.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_12-43-18.png" data-image-height="40" data-image-width="36"/></li>
                            <li>На странице редактирования бронирования - измените дату, место и сохраниет изменения.&nbsp;</li>
                        </ol>
                        <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<img className="confluence-embedded-image" height="250" src={`/files/image2021-5-17_12-49-30.png?${Math.random()}`} data-image-src="/files/image2021-5-17_12-49-30.png?version=1&amp;modificationDate=1621244970465&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532532" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_12-49-30.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_12-49-30.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_12-49-30.png" data-image-height="849" data-image-width="1701"/></p>
                        
                        <h4 id="4_2_3_sd">Удаление бронирования&nbsp;</h4>
                        
                        <p>Удаление бронирования возможно, если это бронирование еще не началось.&nbsp;</p>
                        <p>Чтобы удалить бронирование на вкладке&nbsp;"Мои бронирования" выберите бронирование, которое хотите удалить и нажмите на иконку удаления <img className="confluence-embedded-image confluence-thumbnail" height="34" src={`/files/image2021-5-17_12-51-49.png?${Math.random()}`} data-image-src="/files/image2021-5-17_12-51-49.png?version=1&amp;modificationDate=1621245109021&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532534" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_12-51-49.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_12-51-49.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_12-51-49.png" data-image-height="34" data-image-width="29"/></p>
                        
                        <h3 id="4_3_sd">4.3 Как забронировать с карты&nbsp;</h3>
                        
                        <ol>
                            <li>Откройте план этажа, на котором есть shared desk места, доступные для бронирования.</li>
                            <li>Кликните на место. В открывшемся сайдбаре нажмите на "Выбрать дату бронирования"<br></br><img className="confluence-embedded-image" height="250" src={`/files/image2021-5-17_13-0-55.png?${Math.random()}`} data-image-src="/files/image2021-5-17_13-0-55.png?version=1&amp;modificationDate=1621245655267&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532536" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_13-0-55.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_13-0-55.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_13-0-55.png" data-image-height="593" data-image-width="1022"/></li>
                            <li>Выберите дату и, перемещая, ползунок - задайте дату бронирования и нажмите "Забронировать"<br></br><img className="confluence-embedded-image" height="250" src={`/files/image2021-5-17_13-2-40.png?${Math.random()}`} data-image-src="/files/image2021-5-17_13-2-40.png?version=1&amp;modificationDate=1621245760343&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532537" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_13-2-40.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_13-2-40.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_13-2-40.png" data-image-height="788" data-image-width="1296"/></li>
                        </ol>
                        <p>&nbsp; &nbsp;&nbsp;</p>
                        <p><img className="confluence-embedded-image" height="250" src={`/files/image2021-5-17_13-4-22.png?${Math.random()}`} data-image-src="/files/image2021-5-17_13-4-22.png?version=1&amp;modificationDate=1621245862170&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532539" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_13-4-22.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_13-4-22.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_13-4-22.png" data-image-height="645" data-image-width="1025"/></p>
                        
                        <h3 id="4_4_sd">4.4 Как забронировать через чатбот&nbsp;</h3>
                        
                        <h4 id="4_4_1_sd">Создание бронирования</h4>
                        
                        <ol>
                            <li>Открыть диалог в чатботе Facility Helper в Webex. Создать бронирование можно по ключевым фразам<br></br><span style={{color: "rgb(0,0,0)"}}>-&nbsp;Забронировать место<br></br></span><span style={{color: "rgb(0,0,0)"}}>-&nbsp;Забронировать место,<em> дата, наименование БЦ<br></br><img className="confluence-embedded-image confluence-thumbnail" height="250" src={`/files/image2021-5-17_15-3-13.png`} data-image-src="/files/image2021-5-17_15-3-13.png?version=1&amp;modificationDate=1621252993514&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532564" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_15-3-13.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_15-3-13.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_15-3-13.png" data-image-height="902" data-image-width="629"/><br></br></em></span></li>
                            <li>Выбрать предложенную опцию и отправить боту&nbsp;<br></br><img className="confluence-embedded-image" height="234" src={`/files/image2021-5-17_15-4-7.png?${Math.random()}`} data-image-src="/files/image2021-5-17_15-4-7.png?version=1&amp;modificationDate=1621253047365&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532565" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_15-4-7.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_15-4-7.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_15-4-7.png" data-image-height="234" data-image-width="783"/></li>
                        </ol>
                        <p><br></br></p>
                        
                        <h4 id="4_4_2_sd">Редактирование бронирвоания</h4>
                        
                        <p>По ключевой фразе "Мои заявки" осуществляется просмотр созданных активных бронирований.</p>
                        <p><img className="confluence-embedded-image" height="250" src={`/files/image2021-5-17_15-9-19.png?${Math.random()}`} data-image-src="/files/image2021-5-17_15-9-19.png?version=1&amp;modificationDate=1621253358845&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532566" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_15-9-19.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_15-9-19.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_15-9-19.png" data-image-height="278" data-image-width="532"/></p>
                        <p>Редактирвоание бронирования (дата и (или) место) осуществляется аналогично в режиме диалога поключевой фразе "Редактировать бронирование"</p>
                        <p><img className="confluence-embedded-image confluence-thumbnail" height="250" src={`/files/image2021-5-17_15-10-56.png?${Math.random()}`} data-image-src="/files/image2021-5-17_15-10-56.png?version=1&amp;modificationDate=1621253456502&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532567" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_15-10-56.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_15-10-56.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_15-10-56.png" data-image-height="641" data-image-width="671"/></p>
                        
                        <h4 id="4_4_3_sd">Удаление бронирования</h4>
                        
                        <p>По ключевой фразе "Удалить бронирование", "Удалить заявку" - в режиме диалога бот удалит выбранное бронирование.</p>
                        <p><img className="confluence-embedded-image" height="250" src={`/files/image2021-5-17_15-18-45.png?${Math.random()}`} data-image-src="/files/image2021-5-17_15-18-45.png?version=1&amp;modificationDate=1621253925517&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532571" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-5-17_15-18-45.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_15-18-45.png" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; image2021-5-17_15-18-45.png" data-image-height="362" data-image-width="623"/></p>
                        
                        <h2 id="5_additional">5 Дополнительные возможности&nbsp;</h2>
                        
                        <ul>
                            <li>Скрыть / показать объекты на карте</li>
                            <li>Посмотреть наименование помещения</li>
                        </ul>
                        <p><img className="confluence-embedded-image" height="250" src={`/files/razmetka.gif?${Math.random()}`} data-image-src="/files/%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%82%D0%BA%D0%B0.gif?version=1&amp;modificationDate=1621254563012&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532574" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="разметка.gif" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/gif" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; разметка.gif" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; разметка.gif" data-image-height="620" data-image-width="1258"/></p>
                        <ul>
                            <li>Разметка по проектам и по МВЗ на карте</li>
                        </ul>
                        <p><img className="confluence-embedded-image" height="250" src={`/files/razmetkamvz.gif?${Math.random()}`} data-image-src="/files/%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%82%D0%BA%D0%B0%20%D0%9C%D0%92%D0%97.gif?version=1&amp;modificationDate=1621255088236&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532575" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="разметка МВЗ.gif" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/gif" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; разметка МВЗ.gif" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; разметка МВЗ.gif" data-image-height="620" data-image-width="1258"/></p>
                        <ul>
                            <li>Просмотр сотрудников в проекте/в МВЗ и их режимов работы</li>
                        </ul>
                        <p><img className="confluence-embedded-image" height="250" src={`/files/sotrydniki.gif?${Math.random()}`} data-image-src="/files/%D1%81%D0%BE%D1%82%D1%80%D1%83%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8.gif?version=1&amp;modificationDate=1621255337387&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532577" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="сотрудники.gif" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/gif" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; сотрудники.gif" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; сотрудники.gif" data-image-height="620" data-image-width="1258"/></p>
                        <ul>
                            <li>Загрузка фото профиля и добавление&nbsp; контактного телефона (по желанию сотрудника)</li>
                        </ul>
                        <p><img className="confluence-embedded-image" height="250" src={`/files/profil.gif?${Math.random()}`} data-image-src="/files/%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8C.gif?version=1&amp;modificationDate=1621255799318&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="48532580" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="профиль.gif" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/gif" data-linked-resource-container-id="48532443" data-linked-resource-container-version="12" title="Telco knowledge base &gt; FAQ Navi 2.0 &gt; профиль.gif" data-location="Telco knowledge base &gt; FAQ Navi 2.0 &gt; профиль.gif" data-image-height="620" data-image-width="1258"/></p>
                        <p></p>
                        
                        { user && user.loggingIn && user.user && user.user.rights && 
                              rbac.isSatisfied([rights.DELETE_AVAILABLE_DATES_FOR_PARKING], user.user.rights)
                                ? <>
                                    <h3 id="6_parking"><span style={{color: "rgb(0,0,0)"}}>6 Открытие</span><span style={{color: "rgb(0,0,0)"}}> </span>парковочного места для коллег Владельцем&nbsp; парковочного места</h3>
                                    
                                    <p><span className="confluence-embedded-file-wrapper confluence-embedded-manual-size"><img className="confluence-embedded-image confluence-thumbnail" height="250" src={`/files/car-legend.png?${Math.random()}`} data-image-src="/files/car-legend.png?version=1&amp;modificationDate=1638881817558&amp;api=v2"/></span></p>
                                    
                                    <h4 id="6_1_parking">Открытие дат&nbsp;</h4>
                                    
                                    <ol>
                                        <li>Авторизоваться на портале&nbsp;<a href="https://navi.t-systems.ru/" className="external-link" rel="nofollow">T-Navi</a>&nbsp;</li>
                                    </ol>
                                    <p><span className="confluence-embedded-file-wrapper confluence-embedded-manual-size"><img className="confluence-embedded-image" height="250" src={`/files/image2021-12-15_10-47-28.png?${Math.random()}`} data-image-src="/files/image2021-12-15_10-47-28.png?version=1&amp;modificationDate=1639554448045&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="66682095" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-12-15_10-47-28.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="64946998" data-linked-resource-container-version="9"/></span></p>
                                    <p>2. Открыть спейс парковки нужного БЦ</p>
                                    <p><span className="confluence-embedded-file-wrapper confluence-embedded-manual-size"><img className="confluence-embedded-image" height="250" src={`/files/image2021-12-7_15-47-33.png?${Math.random()}`} data-image-src="/files/image2021-12-7_15-47-33.png?version=1&amp;modificationDate=1638881253288&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="64947005" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-12-7_15-47-33.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="64946998" data-linked-resource-container-version="9"/></span></p>
                                    <p><br></br></p>
                                    <p>3. Выбрать на плане парковки своё парковочное место&nbsp;</p>
                                    <p><span className="confluence-embedded-file-wrapper confluence-embedded-manual-size"><img className="confluence-embedded-image" height="250" src={`/files/image2021-12-7_15-52-22.png?${Math.random()}`} data-image-src="/files/image2021-12-7_15-52-22.png?version=1&amp;modificationDate=1638881542126&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="64947007" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-12-7_15-52-22.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="64946998" data-linked-resource-container-version="9"/></span></p>
                                    <p>4. Нажаь на кнопку "Выбрать даты для sharing"&nbsp;</p>
                                    <p><span className="confluence-embedded-file-wrapper confluence-embedded-manual-size"><img className="confluence-embedded-image confluence-thumbnail" height="250" src={`/files/image2021-12-7_15-54-43.png?${Math.random()}`} data-image-src="/files/image2021-12-7_15-54-43.png?version=1&amp;modificationDate=1638881683589&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="64947011" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-12-7_15-54-43.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="64946998" data-linked-resource-container-version="9"/></span></p>
                                    <p>ползунком в календаре выбрать даты, в которые место будет доступно для бронирования коллегам, нажать на кнопку "Разрешить бронирование места"</p>
                                    <p><span className="confluence-embedded-file-wrapper confluence-embedded-manual-size"><img className="confluence-embedded-image confluence-thumbnail" height="250" src={`/files/image2021-12-7_15-55-9.png?${Math.random()}`} data-image-src="/files/image2021-12-7_15-55-9.png?version=1&amp;modificationDate=1638881709577&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="64947012" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-12-7_15-55-9.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="64946998" data-linked-resource-container-version="9"/></span></p>
                                    <p><br></br></p>
                                    <p>5. В сайдбаре парковочного места будет отображено расписание периода открытых для бронирования дат&nbsp;</p>
                                    <p><span className="confluence-embedded-file-wrapper confluence-embedded-manual-size"><img className="confluence-embedded-image confluence-thumbnail" height="250" src={`/files/image2021-12-7_15-56-57.png?${Math.random()}`} data-image-src="/files/image2021-12-7_15-56-57.png?version=1&amp;modificationDate=1638881817558&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="64947013" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-12-7_15-56-57.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="64946998" data-linked-resource-container-version="9"/></span></p>
                                    <p>Сотрудникам, которые добавлены в группу бронирований парковочного места, придет уведомление на почту об открытых Владельцем дат.&nbsp;</p>
                                    
                                    <h4  id="6_2_parking">Добавление коллег&nbsp;</h4>
                                    
                                    <ol>
                                        <li>Открыть в разделе Бронирования вкладку "Управление SD помещениями"</li>
                                    </ol>
                                    <p><span className="confluence-embedded-file-wrapper confluence-embedded-manual-size"><img className="confluence-embedded-image" height="237" src={`/files/image2021-12-7_15-59-15.png?${Math.random()}`} data-image-src="/files/image2021-12-7_15-59-15.png?version=1&amp;modificationDate=1638881954936&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="64947014" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-12-7_15-59-15.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="64946998" data-linked-resource-container-version="9"/></span></p>
                                    <p>2. В поле "Помещение" ввести адрес своего парковочного места&nbsp; и нажать на кнопку редактирования&nbsp;</p>
                                    <p><span className="confluence-embedded-file-wrapper confluence-embedded-manual-size"><img className="confluence-embedded-image" height="250" src={`/files/image2021-12-7_16-3-27.png?${Math.random()}`} data-image-src="/files/image2021-12-7_16-3-27.png?version=1&amp;modificationDate=1638882207305&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="64947017" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-12-7_16-3-27.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="64946998" data-linked-resource-container-version="9"/></span></p>
                                    <p><br></br></p>
                                    <p>3. В поле "Сотрудник" ввести имя коллеги, которому открывается для бронирования парковочное место&nbsp;</p>
                                    <p>в поле "МВЗ", "Проект" - ввести МВЗ и проекты, которым открывается место и нажать на кнопку "Сохранить"&nbsp;</p>
                                    <p><span className="confluence-embedded-file-wrapper confluence-embedded-manual-size"><img className="confluence-embedded-image" height="250" src={`/files/image2021-12-7_16-15-55.png?${Math.random()}`} data-image-src="/files/image2021-12-7_16-15-55.png?version=1&amp;modificationDate=1638882955101&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="64947021" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-12-7_16-15-55.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="64946998" data-linked-resource-container-version="9"/></span></p>
                                    <p><br></br></p>
                                    
                                    <h4  id="6_3_parking">Бронирование парковочного места&nbsp;</h4>
                                    
                                    <p><strong>ВАЖНО: </strong>парковочное место бронируется на 1 день за сутки до даты наступления бронирования&nbsp;</p>
                                    <p>1) Пользователь открывает план парковки и выбирает место, котрое владельцем открыто ему для бронирования</p>
                                    <p><span className="confluence-embedded-file-wrapper confluence-embedded-manual-size"><img className="confluence-embedded-image" height="250" src={`/files/image2021-12-15_10-13-35.png?${Math.random()}`} data-image-src="/files/image2021-12-15_10-13-35.png?version=1&amp;modificationDate=1639552415732&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="66682058" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-12-15_10-13-35.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="64946998" data-linked-resource-container-version="9"/></span></p>
                                    <p>2) В открывшемся справа сайдбаре нажимает "Забронирвоать на завтра"</p>
                                    <p><span className="confluence-embedded-file-wrapper confluence-embedded-manual-size"><img className="confluence-embedded-image" height="193" src={`/files/image2021-12-15_10-19-56.png?${Math.random()}`} data-image-src="/files/image2021-12-15_10-19-56.png?version=1&amp;modificationDate=1639552796405&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="66682063" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-12-15_10-19-56.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="64946998" data-linked-resource-container-version="9"/></span></p>
                                    <p><br></br></p>
                                    <p>После бронирования места отобразится нотификация о том, чт оместо успешно забронировано.&nbsp;</p>
                                    <p>Посмотреть текущие бронирования можно на вкладке&nbsp;</p>
                                    <p><span className="confluence-embedded-file-wrapper confluence-embedded-manual-size"><img className="confluence-embedded-image" height="250" src={`/files/image2021-12-15_10-26-10.png?${Math.random()}`} data-image-src="/files/image2021-12-15_10-26-10.png?version=1&amp;modificationDate=1639553169820&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="66682068" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image2021-12-15_10-26-10.png" data-base-url="https://wiki.t-systems.ru" data-linked-resource-content-type="image/png" data-linked-resource-container-id="64946998" data-linked-resource-container-version="9"/></span></p>
                                  </>
                            :     <></>
                        }
                        <p><br></br></p>	
                        <p><br></br></p>
                        <p><br></br></p>
                        <p><br></br></p>			
                    </div>
                </div>
            </>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
    };
}


const mapStateToProps = state => {
    
    return {
        user: state.user
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Faq);