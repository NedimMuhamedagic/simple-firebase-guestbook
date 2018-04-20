// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { app as appActions } from '../../modules/app/actions';
import { user as userActions } from '../../modules/user/actions';
import { en } from '../../strings';

type AddUserProps = {
  appState: Object,
  addUser: Function,
  setFormField: Function,
  clearFormField: Function,
  hasAddedUser: boolean,
  userState: Object
}

type AddUserState = {
  hasError: boolean,
  error: string
}

class AddUser extends Component<AddUserProps, AddUserState> {
  inputRef: HTMLInputElement | null;

  state = {
    hasError: false,
    error: '',
  }

  componentDidMount() {
    this.inputRef && this.inputRef.focus();
  }

  render(): ?React$Element<"div"> {
    const { hasAddedUser, appState: { values: { newUser: { value } } } } = this.props;
    const { hasError, error } = this.state;
    return !hasAddedUser ? (
      <div className="User">
        <input
          className="User__element User__input"
          onChange={ this.handleContentChange }
          onKeyPress={ this.handleKeyPress }
          placeholder={ hasError ? error : 'Add new user' }
          ref={ (ref: HTMLInputElement | null): any => (this.inputRef = ref)  }
          type="text"
          value={ value } />
        <button
          className="User__action colorAccent"
          onClick={ this.handleSubmit }>
          { en.USER.add }
        </button>
        <button
          className="User__action colorAlt"
          onClick={ this.handleContentClear }>
          { en.USER.clear }
        </button>
      </div>
    ) : (<div />);
  }

  handleContentChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const { target: { value } } = event;
    const { setFormField } = this.props;
    setFormField(value, 'newUser');
  }

  handleContentClear = () => {
    const { clearFormField } = this.props;
    clearFormField('newUser');
    this.inputRef && this.inputRef.focus();
  }

  handleKeyPress = (e: SyntheticKeyboardEvent<any>) => {
    if ( e.key === 'Enter' ) {
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
    const { addUser, appState: { values: { newUser: { value } } } } = this.props;
    if ( value !== '' ) {
      addUser(value);
      this.setState({
        hasError: false,
        error: '',
      });
    } else {
      this.setState({
        hasError: true,
        error: 'Please enter a name',
      });
      this.inputRef && this.inputRef.focus();
    }
  }
}

const mapStateToProps = ({ appState }: Object): Object => ({
  appState,
});

export default connect(
  mapStateToProps,
  {
    addUser: userActions.addUser,
    clearFormField: appActions.clearFormField,
    setFormField: appActions.setFormField,
  },
)(AddUser);
