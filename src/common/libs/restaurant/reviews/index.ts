
export const getReviewColor = (value: number): string => {
    if (value === 0) {
        return 'text-foreground/20'
    }

    if (value > 0 && value < 2.5) {
        return 'text-red-500'
    }

    if (value >= 2.5 && value <= 4) {
        return 'text-yellow-500'
    }

    if (value > 4) {
        return 'text-green-500'
    }

    return 'text-foreground/20'
}