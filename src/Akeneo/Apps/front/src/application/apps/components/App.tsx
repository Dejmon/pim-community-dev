import * as React from 'react';
import {useHistory} from 'react-router';
import styled from 'styled-components';

import imgUrl from '../../common/assets/illustrations/Api.svg';

const Card = styled.div `
    width: 140px;
    height: 165px;
`;

const Thumbnail = styled.img`
    max-width: 140px;
    max-height: 140px;
    border: 1px solid #a1a9b7;
`;

const Label = styled.div`

`;

interface Props {
    code: string;
    label: string;
}

export const App = ({code, label}: Props) => {
    const history = useHistory();

    return (
        <Card onClick={() => history.push(`/apps/${code}/edit`)}>
            <Thumbnail src={imgUrl} alt={label} />
            <Label>{label}</Label>
        </Card>
    );
};
