import React from "react"

export const Message = ({ 
  children,
  type
 }) => {
  const base = <div className="message">{children}</div>
  switch(type) {
    case "success":
      return React.cloneElement(
        base,
        { className: "message message-success" })
      break
    case "error":
      return React.cloneElement(
        base,
        { className: "message message-error" })
      break
    default:
      return base
  }
}

export const Button = ({ 
  onClickFunc, 
  children,
  type
 }) => {
  const base = <button className="button" onClick={onClickFunc}>{children}</button>
  switch(type) {
    case "success":
      return React.cloneElement(
        base,
        { className: "button button-success" })
      break
    default:
      return base
  }
}

export const RenderIf = ({ cond, children }) => {
  return cond ? <React.Fragment>{children}</React.Fragment> : null  
}
