// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Todo from '../Todo';
import AddTodo from '../AddTodo';
import { objectToOrderedArray } from '../../utils/firebase';

type TodosProps = {
  todoState: Object,
  todos: Object
};

class Todos extends Component<TodosProps> {
  render(): ?React$Element<any> {
    const { todoState: { todos } } = this.props;
    const todoList = objectToOrderedArray(todos);
    return (
      <div className="Todos">
        <AddTodo />
        {
          todoList
            .reverse()
            .map( (singleTodo: Object): ?React$Element<any> => (
              <Todo
                content={ singleTodo.content }
                done={ false }
                editing={ false }
                key={ singleTodo.key }
                timestamp={ singleTodo.timestamp } />
            ))
        }
      </div>
    );
  }
}

const mapStateToProps = ({ todoState }: Object): Object => ({
  todoState,
});
export default connect(mapStateToProps)(Todos);
