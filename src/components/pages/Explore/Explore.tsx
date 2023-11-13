import SearchIcon from '../../icons/search.svg'
import { ExploreItem } from './ExploreItem'
import { Artwork } from '../Landing/Landing'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Pagination, PaginationData } from './Pagination'

export type ExploreData = {
    config: {
        iiif_url: string
    }
    data: []
    pagination: {
        prev_url: string
        next_url: string
        current_page: number
        total_pages: number
    }
}

export const Explore = () => {

    const [iiif_url, set_iiif_url] = useState<string>()
    const [artworks, setArtworks] = useState<Artwork[]>()
    const [pagination, setPagination] = useState<PaginationData>({prev:'', next:'', currentPage: 1, totalPages: 1, itemsToUpdate: (value: ExploreData) => {} })


    const paginatedItems = (value:ExploreData) => {
        refreshData(value)
    }

    const refreshData = (data: ExploreData) => {
        const iiif_url = data.config.iiif_url
            set_iiif_url(iiif_url)
            const resultsArray =  data.data
            setArtworks(resultsArray)
            
            setPagination({
                        prev: data.pagination.prev_url,
                        next: data.pagination.next_url,
                        currentPage: data.pagination.current_page,
                        totalPages: data.pagination.total_pages,
                        itemsToUpdate: paginatedItems
            })

    }

    useEffect(() => {
        const url = `https://api.artic.edu/api/v1/artworks?fields=id,image_id,title,artist_title,[term][is_public_domain}=true,[has_not_been_viewed_much]=false&page=3&limit=${24}`
        axios.get(url)
        .then((res) => {
            refreshData(res.data)
        }).catch(error => {
            console.error('Error:', error)
        })
    }, [])


    return(
        <div className="bg-coffee text-cream h-full w-screen flex flex-col gap-10 px-6 items-center lg:px-12">
            <section className="max-w-full h-min header mt-20 flex flex-col gap-6 items-center">
                <div className="flex flex-col gap-3 text-left sm:text-center items-center">
                    <h1 className=" text-[56px] leading-[56px] font-bold tracking-tighter ">Explore to your hearts content.</h1>
                    <p className="text-xl leading-9 text-cream/60 max-w-2xl">Discover popular artworks, by famous artists recent and from history. Curated by the Art Institute of Chicago</p>
                </div>
                <span className='relative w-full max-w-lg px-0 sm:px-6 bg-green-300/'>
                    <img src={SearchIcon} alt='search icon'
                        className='absolute top-3.5 left-3 sm:left-9'/>
                    <input type='text' placeholder="Search by artist name, title, keywords."
                        className='placeholder:text-cream/50 p-3 pl-11 rounded-xl bg-cream/5 w-full focus:outline-none focus:ring focus:ring-cream' />
                </span>
            </section>
            <section className='flex flex-col gap-8 items-center'>
                <span className='py-1 px-3 rounded-2xl border border-cream/20 text-sm w-fit'>Popular</span>
                <div className='flex flex-wrap justify-around items-center gap-x-14 gap-y-4'>
                    {artworks && artworks.map((piece, index) => {
                       return piece.image_id !==null && <ExploreItem key={piece.id} size={index % 2} piece={piece} iiif_url={iiif_url ? iiif_url : ''}/>
                    })}
                </div>
            </section>
            <Pagination paginationData={pagination}/>
        </div>
    )
}