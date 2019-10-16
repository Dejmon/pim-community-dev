import * as React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.header`
    display: flex;
    height: 44px;
    border-bottom: 1px solid #11324d;
`;

const Title = styled.span`
    line-height: 44px;
    color: #11324d;
    text-transform: uppercase;
    font-size: 13px;
`;

export const Section = ({children}: React.PropsWithChildren<{}>) => (
    <SectionContainer>
        <Title>{children}</Title>
    </SectionContainer>
);
