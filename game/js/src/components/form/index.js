import React from "react"

export const FormSelect = props => (
  <select {...props}>
  {props.options.map((o, i) => <option value={o} key={i}>{o}</option>)}
  </select>
)

export const FormInput = props => (
  <input 
    {...props}
    style={{fontSize: '0.8rem'}} />
)

export const FormLabel = props => {
  return (
    <label style={{fontSize: '0.9rem', color: '#484848'}} {...props}>
      {props.children}
    </label>
  )
}

export const FormWrapper = props => {
  return (
    <form 
      {...props}
      style={{margin: '0rem', marginTop: '1rem'}}
      className="pure-form pure-form-stacked">
      <fieldset>
        {props.children}
      </fieldset>
    </form>
  )
}
