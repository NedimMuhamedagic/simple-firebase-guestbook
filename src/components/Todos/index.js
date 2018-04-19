// @flow
import React, { Component } from 'react';

type TodosProps = {
};

class Todos extends Component<TodosProps> {
  render(): ?React$Element<any> {
    return (
      <div className="Todos">
        <h1>I'm next!</h1>
      </div>
    );
  }
}

export default Todos;
