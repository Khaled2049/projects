import axios from 'axios'
import { Dispatch } from 'redux';
import { ActionTypes } from './types'

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

export const fetchData = () => {
    return async (dispatch: Dispatch) => {
        const response = await axios.get<Todo[]>("https://jsonplaceholder.typicode.com/todos");

        dispatch({
            type: ActionTypes.fetchData,
            payload: response.data
        })
    }
}