import { useEffect, useState } from "react"
import { ExploreItem } from "./ExploreItem"
import axios from "axios"
import { setEmitFlags } from "typescript"

type ExploreResultProps = {
    iiif_url: string
    expandItem: (id: number) => void
}

type Result = {
    api_link: string
    title: string
}

export const ExploreResults = ({iiif_url, expandItem }: ExploreResultProps) => {
    const [results, setResults] = useState<Result[]>()
    const [searchUrl, setSearchUrl] = useState('')

    useEffect(() => {
        const url = ''
        axios.get(searchUrl)
        .then((res) => {
            setResults(res.data)
        })
    })

    return (
        <section className='flex flex-col gap-8 items-center'>
            <span className='py-1 px-3 rounded-2xl border border-cream/20 text-sm w-fit'>Popular</span>
            <div className='flex flex-wrap justify-around items-center gap-x-14 gap-y-4'>
                
            </div>
        </section>
    )
}