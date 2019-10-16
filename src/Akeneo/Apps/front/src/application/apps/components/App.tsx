import * as React from 'react';

interface Props {
    code: string;
    label: string;
}

export const App = ({code, label}: Props) => (
    <div onClick={() => console.log(code)}>
        <img src='#' alt={label} />
        <div>{label}</div>
    </div>
);
