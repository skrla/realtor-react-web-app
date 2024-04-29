import React from 'react'

type InputPropsType = {
    name: string,
    id: string,
    value?: string,
    type?: string,
    onChange?:(e:any) => void,
    className?:string,
    onKeyDown?: (e: any) => void,
    disabled?: boolean
}

function Input({ type = 'text', name, id, value, onChange, className, onKeyDown, disabled} : InputPropsType) {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={`Enter ${name}`}
      className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out ${className}`}
    />
  );
}

export default Input
