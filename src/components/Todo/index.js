// @flow
import React from 'react';

type TodoProps = {
  content: string,
  done: boolean,
  editing: boolean,
  timestamp: Date
}

const Todo = (props: TodoProps): React$Element<"div"> => {
  const { content } = props;
  return (
    <div className="Todo">
      <p className="Todo__element">
        { content }
      </p>
    </div>
  );
};

export default Todo;
