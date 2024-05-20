import { fireEvent, render } from "@testing-library/react";
import { KeyPadDisplay } from ".";

//todo: handlekeydown - handleKeyDown

const mockOnChange = vi.fn((e: number, remove?: boolean) => { });

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

describe('KeyPadDisplay', () => {
    it('should render display and change it when numbers are clicked', async () => {
        const { getByTestId, getByText } = render(<KeyPadDisplay displayValue='' onChange={mockOnChange} />);

        const display = getByTestId('keypad-display');

        expect(display).toBeDefined();
        expect(display.textContent).toBe('  -  ');

        for (let i = 0; i < numbers.length; i++) {
            const button = getByText(numbers[i]);
            expect(button).toBeDefined();
            button.click();
            expect(mockOnChange).toHaveBeenCalledWith(parseInt(numbers[i]), undefined);
        }

        const zero = getByText('0');
        zero.click();
        expect(mockOnChange).toHaveBeenCalledWith(0, undefined);

        const del = getByText('Del');
        del.click();
        expect(mockOnChange).toHaveBeenCalledWith(0, true);
    });

    it('should call handleChange with correct values when keyboard events occur', () => {
        const { getByText } = render(<KeyPadDisplay displayValue='' onChange={mockOnChange} />);
        
        const buttons = numbers.map(num => getByText(num));
        const zeroButton = getByText('0');
        const delButton = getByText('Del');
        
        buttons.forEach((button, index) => {
            const keyDownEvent = new KeyboardEvent('keydown', { key: numbers[index] });
            fireEvent(button, keyDownEvent);
            expect(mockOnChange).toHaveBeenCalledWith(parseInt(numbers[index]), undefined);
        });
        
        const zeroKeyDownEvent = new KeyboardEvent('keydown', { key: '0' });
        fireEvent(zeroButton, zeroKeyDownEvent);
        expect(mockOnChange).toHaveBeenCalledWith(0, undefined);
        
        const backspaceKeyDownEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
        fireEvent(delButton, backspaceKeyDownEvent);
        expect(mockOnChange).toHaveBeenCalledWith(0, true);
    });

});