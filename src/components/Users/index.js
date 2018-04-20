// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import User from '../User';
import AddUser from '../AddUser';
import { objectToOrderedArray } from '../../utils/firebase';

type UsersProps = {
  userState: Object,
  users: Object,
  user: string
};

class Users extends Component<UsersProps> {
  render(): ?React$Element<any> {
    const { userState: { users }, user } = this.props;
    const userList = objectToOrderedArray(users);
    return (
      <div className="Users">
        <AddUser hasAddedUser={ !!user && user !== '' } />
        {
          userList
            .reverse()
            .map( (singleUser: Object): ?React$Element<any> => (
              <User
                id={ singleUser.id }
                key={ singleUser.key }
                name={ singleUser.name }
                owner={ singleUser.key === user }
                timestamp={ singleUser.timestamp } />
            ))
        }
      </div>
    );
  }
}

const mapStateToProps = ({ userState, appState: { user } }: Object): Object => ({
  userState,
  user,
});
export default connect(mapStateToProps)(Users);
