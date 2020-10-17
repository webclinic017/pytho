import React from "react"
import axios from "axios"

const initialState = {
  message: '',
  message_type: ''
}

const actionTypes = {
  show: 'SHOW',
  clear: 'CLEAR'
}

const reducer = (state, action) => {

  switch (action.type) {

    case actionTypes.show:
      return {message: action.message, message_type: action.message_type}
    
    case actionTypes.clear:
      return {message: '', message_type: ''}

    default:
       new Error("Unknown action type")
  }

}

const MessageContext = React.createContext()

export const useMessage = () => {

  const context = React.useContext(MessageContext)
  const { state, dispatch } = context

  const clearMessage = () => dispatch({type: "CLEAR"})

  const successMessage = message => {
    dispatch({type: "SHOW", message, message_type: "SUCCESS"})
    setTimeout(clearMessage, 4000)
  }
  const errorMessage = message => {
    dispatch({type: "SHOW", message, message_type: "ERROR"})
    setTimeout(clearMessage, 4000)
  }

  return {
    state,
    successMessage,
    errorMessage,
    clearMessage
  }
}

export const MessageProvider = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  return <MessageContext.Provider value={{state, dispatch}} {...props} />
}
