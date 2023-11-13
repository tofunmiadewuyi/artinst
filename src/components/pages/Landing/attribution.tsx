type AttributionProps = {
    title: string
    artist: string
    credit_line?: string
}

export const Attribution = ({title, artist, credit_line}: AttributionProps) => {
    return(
        <div className="absolute left-0 bottom-8 w-full  px-10 flex lg:justify-end">
            {/* <p className="font-semibold">Jeanne Bécu, Comtesse Du Barry, and her servant Zamor</p> */}
            {/* <p>Max Beckmann, Margaret Day Blake Collection </p> */}
            <div className="flex flex-col gap-2 text-left text-sm text-cream">
                <p className="font-semibold">{title}</p>
                <p>{artist && `${artist}, `}{credit_line && credit_line}.</p>
            </div>
            
        </div>
    )
}

//absolute bg-red-300 w-full bottom-8 xl:right-8 text-left text-white text-sm flex flex-col gap-2