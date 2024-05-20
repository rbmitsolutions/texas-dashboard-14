import { render, waitFor } from "@testing-library/react";
import ExcelDownloadButton from ".";
import toast from "react-hot-toast";

const mockOnDownloadWithData = vi.fn(async () => [{ title: 'test' }])

const mockOnDownloadWithNoData = vi.fn(async () => [])

vi.mock('react-hot-toast');

describe('ExcelDownloadButton', () => {
    it('should render with and download data', async () => {

        const { getByTestId } = render(<ExcelDownloadButton
            fileName="test"
            onDownload={mockOnDownloadWithData}
            isLoading={false}
        />);

        const csvLinkContainer = getByTestId('csv-link-container');
        const csvLink = csvLinkContainer.querySelector('a');
        expect(csvLink?.getAttribute('download')).toBe('test')

        const button = getByTestId('excel-download-button');
        expect(button.getAttribute('disabled')).toBeNull();

        await vi.waitFor(async () => {
            button.click();
            expect(mockOnDownloadWithData).toHaveBeenCalled()
            const returnFromMockOnDownloadWithData = await mockOnDownloadWithData.mock.results[0].value

            expect(returnFromMockOnDownloadWithData).toEqual([{ title: 'test' }])
        });

    });

    it('should send error message if data is empty', async () => {

        const { getByTestId } = render(<ExcelDownloadButton
            fileName="test"
            onDownload={mockOnDownloadWithNoData}
            isLoading={false}
        />);

        const button = getByTestId('excel-download-button');
        expect(button.getAttribute('disabled')).toBeNull();

        await waitFor(async () => {
            button.click();
            expect(mockOnDownloadWithNoData).toHaveBeenCalled()
            const returnFrommockOnDownloadWithNoData = await mockOnDownloadWithNoData.mock.results[0].value

            expect(returnFrommockOnDownloadWithNoData).toEqual([])

            expect(toast.error).toHaveBeenCalledWith('No data to download')
        });
    });

    it('should render with button disabled', () => {
        const { getByTestId } = render(<ExcelDownloadButton
            fileName="test"
            onDownload={async () => []}
            isLoading={true}
        />);

        const button = getByTestId('excel-download-button');
        expect(button).toBeDefined();
        expect(button.getAttribute('disabled')).toBeDefined();
    });
});