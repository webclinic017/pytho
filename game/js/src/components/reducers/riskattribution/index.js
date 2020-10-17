import React from "react"
import axios from "axios"

const initialState = {
  independent: {},
  dependent: undefined,
  results: {},
  security: '',
  securitySearch: '',
  securityType: 'fund',
  securitiesOptions: [],
  securityTypes : [
    'fund', 
    'etf', 
    'stock', 
    'index'
  ]
}

const actionTypes = {
  addDep: 'ADD_DEP',
  addInd: 'ADD_IND',
  removeDep: 'DEL_DEP',
  removeInd: 'DEL_IND',
  addResults: 'RES',
  clearSecurity: 'CLEAR_SEC',
  selectSecurity: 'SEL_SEC',
  selectSecurityType: 'SEL_SECTYPE',
  searchSecurity: 'SEARCH_SEC',
  inputSecurity: 'INPUT_SEC',
}

const reducer = (state, action) => {

  switch (action.type) {

    case actionTypes.addDep:
      return {
        ...state, 
        dependent: state.security,
        security: '',
        securitySearch: '',
        securityType: 'fund',
        securitiesOptions: []
      } 
     
    case actionTypes.addInd:
      const currentInd = state.independent
      return {
        ...state, 
        independent: {
          [state.security.id]: state.security, 
          ...currentInd
        },
        security: '',
        securitySearch: '',
        securityType: 'fund',
        securitiesOptions: []
      }
      
    case actionTypes.removeDep:
      return {...state, dependent: undefined}

    case actionTypes.removeInd:
      const currentIndState = state.independent
      delete currentIndState[action.id]
      return {...state, independent: currentIndState}

    case actionTypes.addResults:
      return {...state, results: action.results}

    case actionTypes.clearSecurity:
      return {...state, securitiesOptions: [] }

    case actionTypes.selectSecurity:
      return {...state, security: action.security}

    case actionTypes.selectSecurityType:
      return {...state, securityType: action.securityType}

    case actionTypes.searchSecurity:
      return {...state, securitiesOptions: action.options}

    case actionTypes.inputSecurity:
      return {...state, securitySearch: action.input}

    default:
       new Error("Unknown action type")
  }

}

const ModelContext = React.createContext()

export const useModel = () => {

  const context = React.useContext(ModelContext)
  const { state, dispatch } = context

  const addDependent = () => dispatch({type: "ADD_DEP"})
  const addIndependent = () => dispatch({type: "ADD_IND"})
  const removeIndependent = id => dispatch({type: "DEL_IND", id})
  const removeDependent = () => dispatch({type: "DEL_DEP"})

  const runModel = () => {
    const { independent, dependent } = state

    const indString = Object.keys(independent).map(v => `ind=${v}`)
    const riskAttrQs = indString.join('&') + `&dep=${dependent.id}`

    axios.get(process.env.API_URL + `/api/riskattribution?${riskAttrQs}`)
      .then(res => res.data)
      .then(res => dispatch({type: "RES", results: res}))

  }

  const selectSecurity = suggestion => dispatch({type: "SEL_SEC", security: suggestion})
  const selectSecurityType = value => dispatch({type: "SEL_SECTYPE", securityType: value})
  const inputSecurity = security => dispatch({type: "INPUT_SEC", input: security})
  const clearSecurity = () => dispatch({type: "CLEAR_SEC"})

  const searchSecurity = ({value, reason}) => {
    const { securityType } = state
    const searchString = `/api/pricecoveragesuggest?security_type=${securityType}&s=${value}`

    const data = axios.get(process.env.API_URL + searchString)
      .then(res => res.data)
      .then(res => dispatch({type: "SEARCH_SEC", options: res.coverage}))
  }
  

  return {
    state,
    addDependent,
    addIndependent,
    removeIndependent,
    removeDependent,
    runModel,
    selectSecurity,
    selectSecurityType,
    inputSecurity,
    searchSecurity,
    clearSecurity,
  }
}

export const ModelProvider = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  return <ModelContext.Provider value={{state, dispatch}} {...props} />
}
