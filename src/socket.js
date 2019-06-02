import io from 'socket.io-client';

const apiHost = process.env.REACT_APP_API_HOST  || 'http://localhost:3001';

class Socket {
  constructor() {
    this.users = null;
  }
  connect(fn) {
    if (this.users == null) {
      this.users = io(`${apiHost}/users`);
      this.users.on('connect', () => {
        fn(this.users);
      })
      this.users.on('error', () => {
        fn(null);
      })
    } else {
      fn(this.users);
    }
  }
}

const instance = new Socket();
// Object.freeze(instance);

export default instance;