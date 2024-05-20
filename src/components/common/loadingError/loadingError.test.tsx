import { render } from "@testing-library/react"
import LoadingError from "."

describe('LoadingError', () => {
    it('should render Loading component when isLoading is true', () => {
        const { getByTestId } = render(<LoadingError isLoading={true} error={false} />)
        expect(getByTestId('loading-component')).toBeDefined()
    })
    it('should render Error component when error is true', () => {
        const { getByTestId } = render(<LoadingError isLoading={false} error={true} />)
        expect(getByTestId('error-component')).toBeDefined()
    })
})