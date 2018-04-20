// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { app as appActions } from '../../modules/app/actions';
import { user as userActions } from '../../modules/user/actions';

type AddUserProps = {
  appState: Object,
  addUser: Function,
  setFormField: Function,
  clearFormField: Function,
  hasAddedUser: boolean,
  userState: Object
}

class AddUser extends Component<AddUserProps> {
  inputRef: HTMLInputElement | null;

  componentDidMount() {
    this.inputRef && this.inputRef.focus();
  }

  render(): ?React$Element<"div"> {
    const { hasAddedUser, appState: { values: { newUser: { value } } } } = this.props;
    return !hasAddedUser ? (
      <div className="User">
        <input
          className="User__element User__input"
          onChange={ this.handleContentChange }
          onKeyPress={ this.handleKeyPress }
          placeholder="Add new user"
          ref={ (ref: HTMLInputElement | null): any => (this.inputRef = ref)  }
          type="text"
          value={ value } />
        <button
          className="User__action colorAccent"
          onClick={ this.handleSubmit }>
          Add
        </button>
        <button
          className="User__action colorAlt"
          onClick={ this.handleContentClear }>
          Clear
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
    addUser(value);
    this.inputRef && this.inputRef.focus();
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
