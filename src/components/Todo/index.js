// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { todo as todoActions } from '../../modules/todo/actions';

type TodoProps = {
  updateTodo: Function,
  deleteTodo: Function,
  id: string,
  content: string,
  done: boolean,
  timestamp: Date
}

type TodoState = {
  editing: boolean,
  value: string
}

class Todo extends Component<TodoProps, TodoState> {
  state = {
    editing: false,
    value: '',
  }

  componentWillMount() {
    const { content } = this.props;
    this.setState({ value: content });
  }

  componentWillReceiveProps(nextProps: TodoProps) {
    const { content } = nextProps;
    if ( content !== this.state.value ) {
      this.setState({ value: content });
    }
  }

  render(): React$Element<"a"> | React$Element<"div"> {
    const { content, done } = this.props;
    const { editing } = this.state;
    // console.log( editing )
    return editing
      ? this.renderEditing()
      : (
        <div className="Todo">
          <a
            className={ `Todo__element ${ done ? 'done' : '' }` }
            onClick={ this.handleToggleEditing }
            onKeyPress={ this.handleToggleEditing }
            role="button"
            tabIndex={ 0 }>
            { content }
          </a>
          <div className="Todo__actionContainer">
            <button
              className="Todo__action colorAccent"
              onClick={ this.handleSetDone }>
              { done ? 'Not Done' : 'Done' }
            </button>
            <button
              className="Todo__action colorAlt"
              onClick={ this.handleDeleteTodo }>
              Delete
            </button>
          </div>
        </div>
      );
  }

  renderEditing = (): React$Element<"div"> => {
    const { value } = this.state;
    return (
      <div className="Todo">
        <input
          className="Todo__element Todo__input"
          onChange={ this.handleContentChange }
          placeholder="Add new todo"
          type="text"
          value={ value } />
        <div className="Todo__actionContainer">
          <button
            className="Todo__action colorAccent"
            onClick={ this.handleSubmit }>
            Confirm
          </button>
          <button
            className="Todo__action colorAlt"
            onClick={ this.handleCancelEditing }>
            Cancel
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
    const { content } = this.props;
    this.setState({ value: content, editing: false });
  }

  handleSubmit = () => {
    const { value } = this.state;
    const { updateTodo, id } = this.props;
    updateTodo({ content: value, todoId: id });
    this.handleCancelEditing();
  }

  handleSetDone = () => {
    const { updateTodo, id, done } = this.props;
    updateTodo({ done: !done, todoId: id });
  }

  handleDeleteTodo = () => {
    const { id, deleteTodo } = this.props;
    deleteTodo(id);
  }
}

export default connect(
  null,
  {
    updateTodo: todoActions.updateTodo,
    deleteTodo: todoActions.deleteTodo,
  }
)(Todo);
