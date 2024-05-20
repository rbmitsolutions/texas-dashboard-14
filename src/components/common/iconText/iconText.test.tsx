import { render } from '@testing-library/react';
import IconText from '.';


describe('IconText', () => {
    it('Should render with icon and text', () => {
        const { getByText } = render(<IconText icon='AArrowDown' text='arrow' />);

        expect(getByText('arrow')).toBeDefined();
    });

    it('Should render component with loading icon', () => {
        const { getByText } = render(<IconText icon='AArrowDown' text='Arrow Down' isLoading={true} />);

        expect(getByText('...')).toBeDefined();
    });
});
