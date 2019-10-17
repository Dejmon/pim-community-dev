import * as React from 'react';
import Api from '../assets/illustrations/Api.svg';

const Link = (props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => (
    <a {...props} className='AknDescriptionHeader-link link' />
);

const Title = ({children}: React.PropsWithChildren<{}>) => <>{children}</>;

interface Props {
    illustration?: string;
}

export const Helper = ({children, illustration = Api}: React.PropsWithChildren<Props>) => {
    const titleChildren = React.Children.toArray(children).filter(
        child => React.isValidElement(child) && child.type === Title
    );
    const descriptionChildren = React.Children.toArray(children).filter(
        child => !React.isValidElement(child) || child.type !== Title
    );

    return (
        <div className='AknDescriptionHeader'>
            <div
                className='AknDescriptionHeader-icon'
                style={{backgroundImage: `url('${illustration}')`}}
            ></div>
            <div className='AknDescriptionHeader-title'>
                {titleChildren}
                <div className='AknDescriptionHeader-description'>{descriptionChildren}</div>
            </div>
        </div>
    );
};

Helper.Link = Link;
Helper.Title = Title;
