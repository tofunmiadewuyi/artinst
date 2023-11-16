import { useEffect, useState } from "react"
import axios from "axios"

type ExploreResultProps = {
    iiif_url: string
    expandItem: (id: number) => void
    value: string
}

type Result = {
    id: number
    api_link: string
    title: string
}

type PaginationInfo = {
    currentPage: number
    totalPages: number
}

export const ExploreResults = ({iiif_url, expandItem, value }: ExploreResultProps) => {
    const [results, setResults] = useState<Result[]>()
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({currentPage: 1, totalPages: 1})
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        const encodedValue = encodeURIComponent(value)
        const url = `https://api.artic.edu/api/v1/artworks/search?q=${encodedValue}&page=${currentPage}&limit=10`
        axios.get(url)
        .then((res) => {
            setResults(res.data.data)
            setPaginationInfo({
                currentPage: res.data.pagination.current_page,
                totalPages: res.data.pagination.total_pages
            })
        })

        if (value.length < 1) {
            setCurrentPage(1)
        }
    },[value, currentPage])

    const handleClick = (id: number) => {
        expandItem(id)
    }

    const handlePagination = (direction: number) => {
        const totalPages = paginationInfo?.totalPages
        if(currentPage === 1 && direction < 1) {
            return
        } else if(currentPage < totalPages) {
            setCurrentPage(currentPage + direction)
        }
    }

    return (
        <section className='flex w-full flex-col gap-2.5 items-center'>
            { results && results.map((result) => {
            return (<div key={result.id} 
                        className="px-3 w-full py-2 hover:cursor-pointer rounded-xl bg-cream/5= text-left hover:bg-cream/10 hover:scale-105 transition duration-75"
                        onClick={() =>handleClick(result.id)}>
                        <p>{result.title}</p>
                    </div> )
            })}
            <div className="pagination mt-2 text-sm flex gap-2">
                <button className="flex text-[10px] h-6 w-6 font-bold backdrop-blur-sm rounded-lg justify-center items-center bg-cream/10 border border-cream/10 hover:bg-cream/100 hover:text-coffee hover:scale-110 transition duration-100 ease-out"
                        onClick={() => handlePagination(-1)}>
                    {`<-`}
                </button>
                <p className="text-cream/60 font-medium">Result page {paginationInfo?.currentPage} of {paginationInfo?.totalPages}</p>
                <button className="flex text-[10px] h-6 w-6 font-bold backdrop-blur-sm rounded-lg justify-center items-center bg-cream/10 border border-cream/10 hover:bg-cream/100 hover:text-coffee hover:scale-110 transition duration-100 ease-out"
                        onClick={() => handlePagination(+1)}>
                    {`->`}
                </button>
              
            </div>        
        </section>
    )
}