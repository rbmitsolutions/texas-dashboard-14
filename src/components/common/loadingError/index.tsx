import Error from "./_components/error"
import Loading from "./_components/loading"

interface LoadingErrorProps {
    isLoading: boolean
    error: boolean
}

export default function LoadingError({ isLoading, error }: LoadingErrorProps): JSX.Element {
    return (
        <div className='flex-container-center justify-center w-full h-full'>
            {isLoading && <Loading className='h-6 w-6' />}
            {error && <Error />}
        </div>
    )
}