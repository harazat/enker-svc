import Socket from '../socket';

const apiHost = process.env.REACT_APP_API_HOST  || 'http://localhost:3001';
const axios = require('axios');

export const loginUser = (email, password) => {
  return dispatch => {
    axios.get(`${apiHost}/students/${email}`, { auth: {username: email, password: password}})
    .then(response => {
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('password', password);
      Socket.connect(users => {
        users.emit('login', {
          email, 
          password
        });
        dispatch({
          type: 'LOGIN_USER',
          payload: response.data
        });
        // When someone initiates chat send action
        users.on('start-chat', fromUser => {
          console.log('start-chat', fromUser);
          startChat(fromUser)(dispatch);
          dispatch(imReceiver());
        });
      })
    })
    .catch(err => {
      dispatch({
        type: 'LOGIN_USER_ERROR',
        payload: getErrorMessage(err)
      })
    })
  }}

export const createUser = (email, password, firstName, lastName, learningTargets, location) => {
  return dispatch => {
    const user = {
      email,
      password,
      firstName,
      lastName,
      learningTargets,
      location
    };
    axios.post(`${apiHost}/students`, user)
    .then(response => {
      dispatch({
        type: 'CREATE_USER',
        payload: response.data
      })
    })
    .catch(err => {
      dispatch({
        type: 'CREATE_USER_ERROR',
        payload: getErrorMessage(err)
      })
    })
  }
}

export const updateUser = (email, password, firstName, lastName, learningTargets, location) => {
  return (dispatch, getState) => {
    const user = {
      email,
      password,
      firstName,
      lastName,
      learningTargets,
      location
    };
    const state = getState();
    axios.put(`${apiHost}/students/${email}`, user, { auth: {username: email, password: state.user.data.password}})
    .then(response => {
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data
      })
    })
    .catch(err => {
      dispatch({
        type: 'UPDATE_USER_ERROR',
        payload: getErrorMessage(err)
      })
    })
  }
}

export const logoutUser = (user) => {
  return dispatch => {
    Socket.users.emit('logout', user);
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    dispatch({
      type: 'LOGOUT_USER',
    })
  }
}

export const imReceiver = () => ({
  type: 'IM_THE_RECEIVE',
})

export const startChat = (withUser) => {
  return dispatch => {
    dispatch({
      type: 'START_CHAT',
      withUser,
    });
  };
}

export const stopChat = () => {
  return dispatch => {
    dispatch({
      type: 'STOP_CHAT'
    });
  }
}

function getErrorMessage(err) {
  let message = null;
  if (err.response) {
    message = err.response.data.error || err.response.data;
  } else if (err.request) {
    message = "No response from backend service.";
  } else {
    message = err.message;
  }
  console.log(err);
  return message;
}
