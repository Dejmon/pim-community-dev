import * as React from 'react';
import {App as AppInterface} from '../../../domain/apps/app.interface';
import {FlowType} from '../../../domain/apps/flow-type.enum';
import {PimView} from '../../../infrastructure/pim-view/PimView';
import {ApplyButton, Breadcrumb, BreadcrumbItem, Header, Page, Helper} from '../../common';
import {BreadcrumbRouterLink} from '../../shared/router';
import {Translate} from '../../shared/translate';
import {AppGrid} from '../components/AppGrid';

const mockedFetch: {result?: {[code: string]: AppInterface}; error?: Error} = {
    result: {
        AS_400: {code: 'AS_400', label: 'AS_400', flowType: FlowType.DATA_SOURCE},
        MagentoConnector: {code: 'MagentoConnector', label: 'Magento Connector', flowType: FlowType.DATA_DESTINATION},
        Google_Shopping: {code: 'Google_Shopping', label: 'Google Shopping', flowType: FlowType.DATA_DESTINATION},
        Bynder: {code: 'Bynder', label: 'Bynder DAM', flowType: FlowType.OTHER},
    },
    error: undefined,
};

export const ListApp = () => {
    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbRouterLink route={'oro_config_configuration_system'}>
                <Translate id='pim_menu.tab.system' />
            </BreadcrumbRouterLink>
            <BreadcrumbItem onClick={() => undefined} isLast={false}>
                <Translate id='pim_menu.item.apps' />
            </BreadcrumbItem>
        </Breadcrumb>
    );

    const userButtons = (
        <PimView
            className='AknTitleContainer-userMenuContainer AknTitleContainer-userMenu'
            viewName='pim-apps-user-navigation'
        />
    );

    const createButton = (
        <ApplyButton onClick={() => console.log('CREATE')} classNames={['AknButtonList-item']}>
            <Translate id='pim_common.create' />
        </ApplyButton>
    );

    const {result: apps, error} = mockedFetch;

    return (
        <Page>
            <Header breadcrumb={breadcrumb} buttons={[createButton]} userButtons={userButtons}>
                <Translate id='pim_menu.item.apps' />
            </Header>

            <Helper>
                <Helper.Title>
                    <Translate id='pim_apps.helper.title' />
                </Helper.Title>
                <Translate id='pim_apps.helper.description' />
                <br />
                <Helper.Link href='#'>
                    <Translate id='pim_apps.helper.link' />
                </Helper.Link>
            </Helper>

            {error && 'No app declared yet”, “Add your first one by clicking on the “Create” button above.'}

            {apps && <AppGrid apps={apps} />}
        </Page>
    );
};
