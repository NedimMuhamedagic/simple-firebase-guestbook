// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { todo as todoActions } from '../../modules/todo/actions';

type AddTodoProps = {
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
    const { todoState: { value } } = this.props;
    return (
      <div className="Todo">
        <input
          className="Todo__element Todo__input"
          onChange={ this.handleContentChange }
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
    setFormField(value);
  }

  handleContentClear = () => {
    const { clearFormField } = this.props;
    clearFormField();
    this.inputRef && this.inputRef.focus();
  }

  handleSubmit = () => {
    const { addTodo, todoState: { value } } = this.props;
    addTodo(value);
    this.inputRef && this.inputRef.focus();
  }
}

const mapStateToProps = ({ todoState }: Object): Object => ({
  todoState,
});

export default connect(
  mapStateToProps,
  todoActions,
)(AddTodo);
