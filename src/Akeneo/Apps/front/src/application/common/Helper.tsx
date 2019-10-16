import * as React from 'react';

const Title = ({children}: React.PropsWithChildren<{}>) => <>{children}</>;

export const Helper = ({children}: React.PropsWithChildren<{}>) => (
    <div className='AknDescriptionHeader'>
        <div className='AknDescriptionHeader-icon'></div>
        <div className='AknDescriptionHeader-title'>
            {React.Children.toArray(children).filter(child => React.isValidElement(child) && child.type === Title)}
            <div className='AknDescriptionHeader-description'>
                {React.Children.toArray(children).filter(child => !React.isValidElement(child) || child.type !== Title)}
            </div>
        </div>
    </div>
);

const Link = (props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => (
    <a {...props} className='AknDescriptionHeader-link link' />
);

Helper.Title = Title;
Helper.Link = Link;
