import firebase, { fireclass } from '../firebase';
import { EventEmitter as Emitter } from 'events';
import assert from 'assert';

export const FB_DB = firebase.database();

const ENV = {
  dev: 'dev',
  prod: 'production',
};

// TODO: [@NedimMuhamedagic]: set up proper dev and prod environments
const env = ENV.dev;

class DB extends Emitter {
  constructor(args = {}) {
    super();
    let refPath = `/${env}`;
    if (args.path) {
      refPath += `/${args.path}`;
    }
    this.dbRef = FB_DB.ref(refPath);
    args.keepSynced && this.dbRef.keepSynced(true);
    if (args.listen) this.listen();
  }
  childRef(id) {
    return this.dbRef.child(id);
  }
  db() {
    return this.dbRef;
  }
  last(limit = 100) {
    return this.dbRef
      .orderByChild('timestamp')
      .limitToLast(limit)
      .once('value')
      .then(snap => {
        // When you call snapshot.val(), you are getting back a JSON object.
        // The order of keys in a JSON object is determined by your browser
        // and not by Firebase. Hence, we need to reloop
        const sortedObject = {};
        snap.forEach(child => {
          sortedObject[child.key] = child.val(); // NOW THE CHILDREN PRINT IN ORDER
        });
        return Promise.resolve(sortedObject);
      })
      .catch(err => Promise.reject(err));
  }
  find(key, val, opts = {}) {
    return this.dbRef
      .orderByChild(key)
      .equalTo(val)
      .once('value')
      .then(snap => {
        const out = [];
        snap.forEach(x => {
          out.push(this.getPayload(x));
        });

        if (opts.single) {
          return Promise.resolve(out[0]);
        }
        return Promise.resolve(out);
      })
      .catch(err => Promise.reject(err));
  }
  filter(key, args = {}, opts = {}) {
    assert(
      args.startsWith || args.endsWith,
      'Need a startsWith and/or endsWith'
    );
    let query = this.dbRef.orderByChild(key);

    if (args.startsWith) query = query.startAt(args.startsWith);
    if (args.endsWith) query = query.endAt(args.endsWith);

    return query
      .once('value')
      .then(snap => {
        const out = [];
        snap.forEach(item => out.push(this.getPayload(item)));
        if (opts.single) {
          return Promise.resolve(out[0]);
        }
        return Promise.resolve(out);
      })
      .catch(err => Promise.reject(err));
  }
  watchAtProp({ propName, startAtValue, additionalFilter }, emitter) {
    const ref = this.dbRef.orderByChild(propName).startAt(startAtValue);

    ref.on('value', snap => {
      const sortedObject = {};
      snap.forEach(child => {
        const value = child.val();
        // firebase limits what we can filter in a query,
        // so we can run an additional filter here
        if (!additionalFilter || additionalFilter(value)) {
          sortedObject[child.key] = value;
        }
      });
      emitter(sortedObject);
    });

    return () => ref.off('value');
  }
  filterByValue({ child, startsWith, endsWith }) {
    let ref = this.dbRef;
    if (child) {
      ref = ref.child(child);
    }
    if (startsWith || endsWith) {
      ref = ref.orderByValue();
    }
    if (startsWith) {
      ref = ref.startAt(startsWith);
    }
    if (endsWith) {
      ref = ref.endAt(endsWith);
    }

    return ref
      .once('value')
      .then(snap => Promise.resolve(snap.val()))
      .catch(err => Promise.reject(err));
  }
  get(id) {
    return this.dbRef
      .child(id)
      .once('value')
      .then(snap => Promise.resolve(this.getPayload(snap)))
      .catch(err => Promise.reject(err));
  }
  watch(id, emitter) {
    const ref = this.dbRef.child(id);
    ref.on('value', snap => {
      emitter({
        payload: this.getPayload(snap),
        meta: 'change',
      });
    });

    return () => ref.off('value');
  }
  getNextKey(id) {
    return id ? this.dbRef.child(id).push().key : this.dbRef.push().key;
  }
  update(id, args) {
    return id ? this.dbRef.child(id).update(args) : this.dbRef.update(args);
  }
  delete(id) {
    return this.dbRef.child(id).remove();
  }
  save(data) {
    if (!data.id) data.id = this.getNextKey();
    return this.dbRef.child(data.id).set({
      ...data,
      timestamp: fireclass.database.ServerValue.TIMESTAMP,
    });
  }
  // TODO[@sarahatwork] make a way to skip the change listener,
  // since we don't always need it
  createListeners({ startAt, child, shouldLimitToLast } = {}, emitter) {
    let ref = this.dbRef.orderByChild('timestamp');
    if (child) {
      ref = ref.child(child);
    }

    // We create a separate ref for listening to child_added
    // so that we can do a filter to optimize the initial batch of requests
    let addRef = ref;

    if (startAt) {
      addRef = addRef.startAt(startAt);
    }

    if (shouldLimitToLast) {
      addRef = addRef.endAt().limitToLast(1);
    }

    addRef.on('child_added', snap => {
      emitter({
        payload: this.getPayload(snap),
        meta: 'add',
      });
    });

    ref.on('child_changed', snap => {
      emitter({
        payload: this.getPayload(snap),
        meta: 'change',
      });
    });

    ref.on('child_removed', snap => {
      emitter({
        payload: this.getPayload(snap),
        meta: 'remove',
      });
    });

    return () => {
      addRef.off('child_added');
      ref.off('child_changed');
      ref.off('child_removed');
    };
  }
  getPayload(snap) {
    if (!snap) return null;
    if (!snap.val) {
      // eslint-disable-next-line no-console
      console.log(snap);
    }
    const value = snap.val();

    if (!value) return null;

    return typeof value === 'object' ? { key: snap.key, ...value } : snap.key;
  }
  listen() {
    this.dbRef.on('child_added', snap => {
      this.emit('add', snap.val());
    });
    this.dbRef.on('child_changed', snap => this.emit('change', snap.val()));
    this.dbRef.on('child_removed', snap => this.emit('remove', snap.val()));
  }
}

export default DB;
