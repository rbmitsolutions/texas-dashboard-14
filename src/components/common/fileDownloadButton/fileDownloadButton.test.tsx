import { IFiles, IFilesAs, IFilesType } from "@/common/types/company/files.interface";
import { render, renderHook } from "@testing-library/react";
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { IUseGETCompanyDataHooks, useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks";
import FileDownloadButton from ".";


const mockFile: IFiles = {
    id: '1',
    title: 'test',
    description: 'test',
    public_id: '1',
    signature: '1',
    secure_url: '1',
    as: IFilesAs.AVATAR,
    type: IFilesType.IMAGE,
    url: '1',
    key: '1',
    created_at: new Date(),
    updated_at: new Date()
}

const mockOnFetch = vi.fn()

vi.mock('react-hot-toast');
vi.mock('react-query');
vi.mock('@/hooks/company/companyDataHooks', () => {
    return {
        useGETCompanyDataHooks: ({
            query,
            keepParmas = false,
            defaultParams,
            UseQueryOptions,
        }: IUseGETCompanyDataHooks) => {
            return {
                refetchCompanyData: mockOnFetch,
                compnayFileData: mockFile,
                setGETCompanyDataParams: vi.fn(),
            }
        }
    }

});

describe('FileDownloadButton', () => {
    it('Should render and download file', async () => {
        const { getByTestId } = await render(<FileDownloadButton file={mockFile} />);

        const fileDownloadButton = getByTestId('file-download-button');
        const link = getByTestId('file-download-link')
        expect(fileDownloadButton).toBeDefined();
        expect(link).toHaveAttribute('href', mockFile.secure_url);

        fileDownloadButton.click();

        // await new Promise(resolve => setTimeout(resolve, 100));

        // await vi.waitFor(() => {
        //     expect(link.click).toHaveBeenCalled();
        // });

    })
    it('Should render and download file from the file_id without error', async () => {
        // const { getByTestId } = render(<FileDownloadButton file_id='1' />);
        // const { result } = renderHook(() => useGETCompanyDataHooks({
        //     query: 'FILES',
        //     defaultParams: {
        //         files: {
        //             byId: {
        //                 id: '1'
        //             }
        //         }
        //     },
        //     UseQueryOptions: {
        //         onSuccess: (data) => {
        //             expect(data).toEqual(mockFile);
        //         },
        //         onError: () => {
        //             expect(toast.error).toHaveBeenCalledWith('Error fetching file')
        //         },
        //         enabled: true
        //     }
        // }));

        // expect(result.current.compnayFileData).toEqual(mockFile);

    })
})