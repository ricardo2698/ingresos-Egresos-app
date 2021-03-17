import { User } from './user.model';
import * as fromAuth from'./auth.actions';

export interface AuthState {
  user: User;
}

const estadoInicial: AuthState= {
  user: null
}

export function authReducer( state = estadoInicial, action: fromAuth.acciones): AuthState{

  switch(action.type){

    case fromAuth.SET_USER:
      return {
        user: {... action.user }
      }

    case fromAuth.UN_SET_USER:
      return {
        user: null
      }

    default:
      return state;
  }
}
