// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { app as appActions } from '../../modules/app/actions';
import { todo as todoActions } from '../../modules/todo/actions';

type AddTodoProps = {
  appState: Object,
  addTodo: Function,
  setFormField: Function,
  clearFormField: Function,
  todoState: Object
}

class AddTodo extends Component<AddTodoProps> {
  inputRef: HTMLInputElement | null;

  componentDidMount() {
    this.inputRef && this.inputRef.focus();
  }

  render(): ?React$Element<"div"> {
    const { appState: { values: { newTodo: { value } } } } = this.props;
    return (
      <div className="Todo">
        <input
          className="Todo__element Todo__input"
          onChange={ this.handleContentChange }
          onKeyPress={ this.handleKeyPress }
          placeholder="Add new todo"
          ref={ (ref: HTMLInputElement | null): any => (this.inputRef = ref)  }
          type="text"
          value={ value } />
        <button
          className="Todo__action colorAccent"
          onClick={ this.handleSubmit }>
          Add
        </button>
        <button
          className="Todo__action colorAlt"
          onClick={ this.handleContentClear }>
          Clear
        </button>
      </div>
    );
  }

  handleContentChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const { target: { value } } = event;
    const { setFormField } = this.props;
    setFormField(value, 'newTodo');
  }

  handleContentClear = () => {
    const { clearFormField } = this.props;
    clearFormField('newTodo');
    this.inputRef && this.inputRef.focus();
  }

  handleKeyPress = (e: SyntheticKeyboardEvent<any>) => {
    if ( e.key === 'Enter' ) {
      this.handleSubmit();
    }
  }
  handleSubmit = () => {
    const { addTodo, appState: { values: { newTodo: { value } } } } = this.props;
    addTodo(value);
    this.inputRef && this.inputRef.focus();
  }
}

const mapStateToProps = ({ appState }: Object): Object => ({
  appState,
});

export default connect(
  mapStateToProps,
  {
    addTodo: todoActions.addTodo,
    clearFormField: appActions.clearFormField,
    setFormField: appActions.setFormField,
  },
)(AddTodo);
