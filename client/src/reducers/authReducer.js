import { FETCH_USER } from '../actions/types';

// "" is a false value in action.payload
export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false;
    default:
      return state;
  }
}
