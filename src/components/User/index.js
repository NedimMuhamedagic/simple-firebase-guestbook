// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { user as userActions } from '../../modules/user/actions';
import { en } from '../../strings/index';

type UserProps = {
  updateUser: Function,
  deleteUser: Function,
  id: string,
  name: string,
  timestamp: Date,
  owner: boolean
}

type UserState = {
  editing: boolean,
  value: string
}

class User extends Component<UserProps, UserState> {
  state = {
    editing: false,
    value: '',
  }

  componentWillMount() {
    const { name } = this.props;
    this.setState({ value: name });
  }

  componentWillReceiveProps(nextProps: UserProps) {
    const { name } = nextProps;
    if ( name !== this.state.value ) {
      this.setState({ value: name });
    }
  }

  render(): React$Element<"a"> | React$Element<"div"> {
    const { name, owner } = this.props;
    const { editing } = this.state;
    return editing
      ? this.renderEditing()
      : (
        <div className="User">
          <a
            className="User__element"
            onClick={ owner ? this.handleToggleEditing : null }
            onKeyPress={ owner ? this.handleToggleEditing : null }
            role="button"
            tabIndex={ 0 }>
            { name }
          </a>
          {
            owner && (
              <div className="User__actionContainer">
                <button
                  className="User__action colorAccent"
                  onClick={ this.handleToggleEditing }>
                  { en.USER.edit }
                </button>
                <button
                  className="User__action colorAlt"
                  onClick={ this.handleDeleteUser }>
                  { en.USER.delete }
                </button>
              </div>
            )
          }
        </div>
      );
  }

  renderEditing = (): React$Element<"div"> => {
    const { value } = this.state;
    return (
      <div className="User">
        <input
          className="User__element User__input"
          onChange={ this.handleContentChange }
          placeholder="Add new user"
          type="text"
          value={ value } />
        <div className="User__actionContainer">
          <button
            className="User__action colorAccent"
            onClick={ this.handleSubmit }>
            { en.USER.confirm }
          </button>
          <button
            className="User__action colorAlt"
            onClick={ this.handleCancelEditing }>
            { en.USER.cancel }
          </button>
        </div>
      </div>
    );
  }

  handleToggleEditing = () => {
    const { editing } = this.state;
    this.setState({ editing: !editing });
  }

  handleContentChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const { target: { value } } = event;
    this.setState({ value });
  }

  handleCancelEditing = () => {
    const { name } = this.props;
    this.setState({ value: name, editing: false });
  }

  handleSubmit = () => {
    const { value } = this.state;
    const { updateUser, id } = this.props;
    updateUser({ name: value, userId: id });
    this.handleCancelEditing();
  }

  handleDeleteUser = () => {
    const { id, deleteUser } = this.props;
    deleteUser(id);
  }
}

export default connect(
  null,
  {
    updateUser: userActions.updateUser,
    deleteUser: userActions.deleteUser,
  }
)(User);
