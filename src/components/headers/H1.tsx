import React from 'react'

type H1PropsType = {
  title: string
  className?: string;
};

function H1({className, title}: H1PropsType) {
  return (
    <h1 className={`text-3xl text-center mt-6 font-bold ${className}`}>
        {title}
    </h1>
  );
}

export default H1
