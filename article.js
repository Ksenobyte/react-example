import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Avatar from './../dependencies/UserInStory/Avatar'
import Nickname from './../dependencies/UserInStory/Nickname'
import Date from './../dependencies/UserInStory/Date'
import ViewCounter from './../dependencies/UserInStory/ViewCounter'
import Posthtml from './../dependencies/PostPreview/PostHtml'
import Footer from './Footer'
import CommentsConnection from '../../containers/CommentsConnection'



export default class Article extends Component {

    cnst = {
        protocol: 'https://',
        host: '******.ru'
    }

    componentDidMount() {
        if (!this.props.fromServer) {
            let id = this.props.match.params.wildcard;
            this.props.actions.getDetailArticle(id, this.props.history);
            window.scrollTo(0, 228);
        }
    } 

    shouldComponentUpdate(nextProps) {
        if (
            this.props.loading != nextProps.loading 
            || this.props.match.params.wildcard != nextProps.match.params.wildcard
            || (this.props.currentUser.isLogged != nextProps.currentUser.isLogged) && !this.props.loading
            || this.props.token != nextProps.token
        ) {
            return true;
        }
        
        return false;
    }

    componentWillUnmount() {
        //call api next time Component mounting
        if (this.props.fromServer) {
            this.props.actions.allowRender();
        }
    }

    componentDidUpdate(prevProps) {   
        if (prevProps.match.url !== this.props.match.url || prevProps.currentUser.data.id !== this.props.currentUser.data.id) {
            let id = this.props.match.params.wildcard;
            this.props.actions.getDetailArticle(id, this.props.history);
            window.scrollTo(0, 228);
        }
    }

    render() {
        
        let {
            id,
            user,
            date_approve,
            view_count,
            like_count,
            dislike_count,
            comment_count,
            body,
            title,
            meta_title,
            like,
            sections
        } = this.props.post;
        let html;

        let categories;
        
        let date = date_approve.split(' ')[0];

        let time = date_approve.split(' ')[1];

        let { isLogged } = this.props.currentUser;

        let isSameUser = this.props.currentUser.data.id == user.id ? true : false;

        let isLoggedUserClassName = isLogged ? '' : ' not-logged';

        let sameUserClassName = isSameUser ? ' is-same-users' : '';

        let {
            type: isAdmin,
            banned: isBanned
        } = this.props.currentUser.data;

        if (body) {
            let data = JSON.parse(body);

            html = data.map((element, index) => {
                if (element.type === 'text') {
                    return (
                        <Posthtml key={index} html={element.data} />
                    );
                } else if (element.type === 'image') {
                    return (
                        <img className="detail-story__image-block" key={index} src={`https://*******.ru${element.data.url}`} alt="" />
                    )
                } else if (element.type === 'video') {
                    return (
                        <iframe className="video-block__item" src={`https://www.youtube.com/embed/${element.data}`} key={index} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                    );
                }
            });
        }

        if (sections) {
            categories = sections.map((element, index) => (
                <li className="story-categories__item" key={index}><Link to={`/category/${element.url}`}>{element.name}</Link></li>
            ));
        }

        return (
            <section className={`with-sidebar__content${isLoggedUserClassName}${sameUserClassName}`}>

                <Helmet>

                    <title>{meta_title || title}</title>

                </Helmet>
                
                {
                    this.props.loading ? <div className="loader loader_big loader_centered" /> :
                    <article className="story detail-story">

                        {
                            isLogged && isAdmin == 1 &&
                            <Link className="btn btn_gray_transparent story__edit-btn" to={`/edit/${this.props.match.params.wildcard}`}>Редактировать</Link>
                        }

                        {
                            categories &&
                            <ul className="story-categories">

                                {categories}

                            </ul>
                        }

                        <header className="story__header user-in-story">

                            <div className="user-in-story__left">

                                <Avatar avatarSrc={user.images.user_100} userLink={'/user/' + user.id} />

                                <div className="user-in-story__info">

                                    <Nickname userName={user.name} userLink={'/user/' + user.id} />

                                    <div className="user-in-story__date">

                                        <Date postDate={date} postTime={time} />

                                    </div>

                                </div>
                    
                            </div>

                            <div className="user-in-story__right">

                                <ViewCounter viewCount={view_count} />

                            </div>

                        </header>

                        <h1 className="detail-story__title">{title}</h1>

                        <div className="detail-story__content">

                            { html }

                        </div> 

                        <Footer 
                            article={this.props.post} 
                            id={id}
                            link={this.cnst.protocol + this.cnst.host + this.props.match.url}
                            isLogged={isLogged}
                            isBanned={isBanned}
                            isSameUsers={isSameUser}
                            value={like} 
                            token={this.props.token} 
                            counts={{ 
                                likes: like_count, 
                                dislikes: dislike_count, 
                                comments: comment_count
                            }} 
                            cnst={this.cnst}
                        />
 
                    </article>
                }

                <CommentsConnection currentUser={{isLogged, isAdmin, isBanned}} id={id} />

            </section>
        );
    }
}
