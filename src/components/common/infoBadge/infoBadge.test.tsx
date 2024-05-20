import { render } from '@testing-library/react';
import InfoBadge from '.';

describe('InfoBadge', () => {

    it('Should render with status and orange', () => {
        const { getByText } = render(<InfoBadge status='unsent' />);
        expect(getByText('unsent')).toBeDefined();
        expect(getByText('unsent').className).contains('bg-orange-600');
    });

    it('Should render with status and green', () => {
        const { getByText } = render(<InfoBadge status='done' />);
        expect(getByText('done')).toBeDefined();
        expect(getByText('done').className).contains('bg-green-600 dark:bg-green-300 hover:bg-green-700 dark:hover:bg-green-400');
    });

    it('Should render with status and red', () => {
        const { getByText } = render(<InfoBadge status='unconfirmed' />);
        expect(getByText('unconfirmed')).toBeDefined();
        expect(getByText('unconfirmed').className).contains('bg-red-600 dark:bg-red-300 hover:bg-red-700 dark:hover:bg-red-400');
    });

    it('Should render with status and yellow', () => {
        const { getByText } = render(<InfoBadge status='canceled' />);
        expect(getByText('canceled')).toBeDefined();
        expect(getByText('canceled').className).contains('bg-yellow-600 dark:bg-yellow-300 hover:bg-yellow-700 dark:hover:bg-yellow-400');
    });

    it('Should render with status and purple', () => {
        const { getByText } = render(<InfoBadge status='arrived' />);
        expect(getByText('arrived')).toBeDefined();
        expect(getByText('arrived').className).contains('bg-purple-600 dark:bg-purple-300 hover:bg-purple-700 dark:hover:bg-purple-400');
    });

    it('Should render with status and pink', () => {
        const { getByText } = render(<InfoBadge status='walk_in' />);
        expect(getByText('walk_in')).toBeDefined();
        expect(getByText('walk_in').className).contains('bg-pink-600 dark:bg-pink-300 hover:bg-pink-700 dark:hover:bg-pink-400');
    });

    
});
