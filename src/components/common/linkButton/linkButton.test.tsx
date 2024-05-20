import { render } from "@testing-library/react";
import LinkButton from ".";

describe('LinkButton', () => {
    it('Should render with default icon', () => {
        const { getByTestId } = render(
            <LinkButton href='/test' />
        );
        expect(getByTestId('link-button-component')).toBeDefined();
        const linkElement = getByTestId('link-button-component');
        const href = linkElement.getAttribute('href');
        expect(href).toEqual('/test');
    });
})