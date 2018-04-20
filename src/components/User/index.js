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
  value: string,
  hasError: boolean,
  error: string
}

class User extends Component<UserProps, UserState> {
  inputRef: HTMLInputElement | null;

  state = {
    editing: false,
    value: '',
    hasError: false,
    error: '',
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
    const { value, hasError, error } = this.state;
    return (
      <div className="User">
        <input
          className="User__element User__input"
          onChange={ this.handleContentChange }
          onKeyPress={ this.handleKeyPress }
          placeholder={ hasError ? error : 'Add new user' }
          ref={ (ref: HTMLInputElement | null): any => (this.inputRef = ref)  }
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

  handleKeyPress = (e: SyntheticKeyboardEvent<any>) => {
    if ( e.key === 'Enter' ) {
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
    const { value } = this.state;
    if ( value !== '' ) {
      const { updateUser, id } = this.props;
      updateUser({ name: value, userId: id });
      this.setState({ editing: false });
    } else {
      this.setState({
        hasError: true,
        error: 'Please enter a name',
      });
      this.inputRef && this.inputRef.focus();
    }
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
