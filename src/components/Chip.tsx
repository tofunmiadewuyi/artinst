
type ChipProps = {
    label: string
}

export const Chip = ({label}: ChipProps) => {
    return (
        <span className="py-1 px-3 rounded-3xl bg-white/10 text-sm leading-6 font-medium whitespace-nowrap capitalize">
            {label}
        </span>
    )
}