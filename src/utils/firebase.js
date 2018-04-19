// @flow
import DB from './database';
export const rootDB = new DB();
export const appDB = new DB({ path: 'app' });

export const createToDoRef = (todoId: string): DB =>
  new DB({ path: `users/${todoId}`, keepSynced: true });

export function updateRootDB({ id, args }: Object): any {
  return rootDB.update(id, args);
}

export function objectToOrderedArray(collection: Object): Array<Object> {
  return (
    Object.keys(collection)
      // transform object into array
      .map((key: string): Object => ({ ...collection[key], id: key }))
      // order by sequenceId
      .sort((a: Object, b: Object): number => a.sequenceId - b.sequenceId)
      // remove sequenceId prop
      .map((item: Object): Object => {
        delete item.sequenceId;
        return item;
      })
  );
}
