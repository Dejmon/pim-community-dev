import * as React from 'react';
import {App as AppInterface} from '../../../domain/apps/app.interface';
import {FlowType} from '../../../domain/apps/flow-type.enum';
import {App} from './App';
import {Section} from '../../common';
import {Translate} from '../../shared/translate';
import styled from 'styled-components';

const Grid = styled.div`
    margin-top: 20px;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
`;

interface Props {
    apps: AppInterface[];
}

export const AppGrid = ({apps}: Props) => {
    console.log(apps)
    const dataSourceApps = apps.filter(app => FlowType.DATA_SOURCE === app.flowType);
    const dataDestinationApps = apps.filter(app => FlowType.DATA_DESTINATION === app.flowType);
    const otherApps = apps.filter(app => FlowType.OTHER === app.flowType);

    const renderApp = (app: AppInterface) => <App code={app.code} label={app.label} key={app.code} />;

    return (
        <>
            <Section>
                <Translate id='pim_apps.flow_type.data_source' count={dataSourceApps.length} />
            </Section>
            <Grid>{dataSourceApps.map(renderApp)}</Grid>

            <Section>
                <Translate id='pim_apps.flow_type.data_destination' count={dataDestinationApps.length} />
            </Section>
            <Grid>{dataDestinationApps.map(renderApp)}</Grid>

            <Section>
                <Translate id='pim_apps.flow_type.other' count={otherApps.length} />
            </Section>
            <Grid>{otherApps.map(renderApp)}</Grid>
        </>
    );
};
