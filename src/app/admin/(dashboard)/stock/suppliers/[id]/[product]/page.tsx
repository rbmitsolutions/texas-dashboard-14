export default function Product({ params }: { params: { id: string, product: string } }) {
    return (
        <div>
            {params?.product}
        </div>
    )
}