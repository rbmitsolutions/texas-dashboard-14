import { render } from '@testing-library/react';
import InfoBox from '.';

describe('InfoBox', () => {
    it('Should render with title and value', () => {
        const { getByText } = render(
            <InfoBox
                icon={{
                    name: 'AArrowDown'
                }}
                title='test'
                value='200'
                smallValue='small value'
            />
        );
        expect(getByText('test')).toBeDefined();
        expect(getByText('200')).toBeDefined()
        expect(getByText('small value')).toBeDefined()
    });

    it('Should render with default small value', () => {
        const { getByText } = render(
            <InfoBox
                icon={{
                    name: 'AArrowDown'
                }}
                title='test'
                value='200'
            />
        );
        expect(getByText('-')).toBeDefined()
    });

    it('Should render Loading component', () => {
        const { getByTestId } = render(
            <InfoBox
                icon={{
                    name: 'AArrowDown'
                }}
                title='test'
                value='200'
                isLoading={true}
            />
        );

        expect(getByTestId('loading-error-component')).toBeDefined();
    });

    it('Should render Error component', () => {
        const { getByTestId } = render(
            <InfoBox
                icon={{
                    name: 'AArrowDown'
                }}
                title='test'
                value='200'
                error={true}
            />
        );

        expect(getByTestId('loading-error-component')).toBeDefined();
    });

});
