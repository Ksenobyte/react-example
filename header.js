import React, { Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'

import Logo from '../resources/svg/Logo'
import Plus from '../resources/svg/Plus'
import Search from '../resources/svg/Search'
import SearchClose from '../resources/svg/SearchClose'
import AuthPlate from './header/AuthPlate'
import UserPlate from './header/UserPlate'
import Admin from './../resources/svg/Admin'
import MobileMenu from './MobileMenu'
import * as modals from './../constants/modals'
import NotificationPlate from './notifications/NotificationsPlate'
import AddArticleWrapper from './header/AddArticleWrapper'

const Header = ({ user, header, actions, history}) => (
    <Fragment>

        <Link className="top-banner" onClickCapture={() => actions.stabilizeApp()} to="/contest">

            <div className="container">

                    <img className="top-banner__image" src="https://*******.ru/images/iphone_contest/iphone.png" alt=""/>

            </div>

        </Link>

        <header className={`header${user.isLogged ? '' : ' header_not-logged'}`}>

            <div className="container">
    
                <div className="header__items">

                    <div className="hamburger header__hamburger js-open-mobile-menu" onClick={() => actions.openMenu()}>

                        <div className="hamburger__line"></div>

                        <div className="hamburger__line"></div>

                        <div className="hamburger__line"></div>

                    </div>

                    <div className={`header__logo${user.isLogged ? '' : ' header__logo_not-logged'} ${header.searchIsOpened ? 'header__logo_hide' : ''}`}>

                        <Link to="/" className="logo" onClickCapture={() => actions.stabilizeApp()} >

                            <Logo />

                        </Link>

                    </div>


                    <div onClickCapture={user.isLogged ? () => actions.stabilizeApp() : () => actions.setModal(modals.MODAL_LOGIN, '/add_article')} className={header.searchIsOpened ? 'header__button header__button_hide' : 'header__button'}>

                    <AddArticleWrapper isLogged={user.isLogged}>
                            <Plus />
                            <span className="btn__text">Разместить статью</span>
                    </AddArticleWrapper>

                    </div>
                    

                    <div className={header.searchIsOpened ? 'header__action header__action_opened' : 'header__action'}>

                        {
                            user.isLogged &&
                            <UserPlate />
                        }

                        {
                            !user.isLogged &&
                            <AuthPlate actions={actions} />
                        }

                        <div className="header__search search">

                            <Search actions={actions} history={history} />

                            <form className="search__wrapper" onSubmit={(e) => actions.doSearch(e,history)}>

                                <div className="search__close js-close-search">

                                    <SearchClose actions={actions} />

                                </div>

                                <input className="search__field" type="text" placeholder="Поиск по сайту" />

                            </form>

                        </div>

                    </div>

                </div>

                {
                    user.isLogged &&
                    <NotificationPlate removeNotifications={actions.removeNotifications} flag={header.notificationsIsOpened} notifications={header.notifications} />
                }

            </div>

            {
                user.isAdmin === 1 &&
                <a target="_blank" className="admin-link" href="https://*******.ru/admin">
                    <Admin />
                </a>
            }

            <MobileMenu flag={header.menuIsOpened} actions={actions} user={user} categories={header.categories} />

        </header>
    </Fragment>
);

export default withRouter(Header);
