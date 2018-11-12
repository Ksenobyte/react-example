import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import CloseRed from '../../resources/svg/CloseRed'

@connect(state => ({
    user_id: state.otherUser.userId,
    targetUserName: state.otherUser.userInfo.name,
    force_user_id: state.modals.params.message_user_id,
    force_user_name: state.modals.params.message_user_name
}))
export default class SendMessage extends PureComponent {

    state = {
        val: ''
    }

    onValueChanged(e) {
        this.setState({ 
            val: e.target.value 
        });
    }

    render() {
        let {
            setModal,
            dropModal,
            sendMessage
        } = this.props.actions;

        let {
            user_id,
            targetUserName,
            token,
            force_user_id,
            force_user_name
        } = this.props;

        if (force_user_id != undefined) {
            user_id = force_user_id,
            targetUserName = force_user_name
        }

        return (
            <form className="modal__wrapper modal__wrapper_active modal__message modal-message">

            <h3 className="modal__title modal__title_small modal__title_center modal__title_blue modal-message__title">Сообщение для {targetUserName}</h3>

                <textarea className="modal-message__field" placeholder="Ваше сообщение" autoFocus value={this.state.val} onChange={(e) => this.onValueChanged(e)} />

                <div className="modal-message__buttons">

                    <button type="button" className="btn btn_blue modal-message__send" onClick={() => sendMessage(this.state.val, user_id, token)}>Отправить</button>

                    <button type="button" className="modal-message__close" onClick={() => dropModal()}>

                        <CloseRed className="modal-message__close-icon" />

                        Отмена

                    </button>

                </div>

            </form>
        );
    }
}
