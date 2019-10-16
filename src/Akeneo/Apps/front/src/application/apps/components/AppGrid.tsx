import * as React from 'react';
import {App as AppInterface} from '../../../domain/apps/app.interface';
import {FlowType} from '../../../domain/apps/flow-type.enum';
import {App} from './App';
import {Section} from '../../common';
import {Translate} from '../../shared/translate';

interface Props {
    apps: {[code: string]: AppInterface};
}

export const AppGrid = ({ apps }: Props) => {
    const dataSourceApps = Object.values(apps).filter(app => FlowType.DATA_SOURCE === app.flowType);
    const dataDestinationApps = Object.values(apps).filter(app => FlowType.DATA_DESTINATION === app.flowType);
    const otherApps = Object.values(apps).filter(app => FlowType.OTHER === app.flowType);

    const renderApp = (app: AppInterface) => <App code={app.code} label={app.label} key={app.code} />;

    return (
        <>
            <Section>
                <Translate id='pim_apps.flow_type.data_source' count={dataSourceApps.length} />
            </Section>
            {dataSourceApps.map(renderApp)}

            <Section>
                <Translate id='pim_apps.flow_type.data_destination' count={dataDestinationApps.length} />
            </Section>
            {dataDestinationApps.map(renderApp)}

            <Section>
                <Translate id='pim_apps.flow_type.other' count={otherApps.length} />
            </Section>
            {otherApps.map(renderApp)}
        </>
    );
};
