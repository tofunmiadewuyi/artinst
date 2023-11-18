import { ExploreData, SearchUpdateAction, SearchResetAction } from '../../../types'
import { ExploreItem } from './ExploreItem'
import { Artwork } from '../Landing/Landing'
import { useEffect, useReducer, useState } from 'react'
import { Pagination, PaginationData } from './Pagination'
import SearchIcon from '../../icons/search.svg'
import clearIcon from '../../icons/clear.svg'
import axios from 'axios'
import '../../../index.css'
import { ExploreResults } from './SearchResults'
import { PiecePage } from '../Piece/Piece'


const initialPaginationState = {
    prev:'',
    next:'', 
    currentPage: 1, 
    totalPages: 1, 
    itemsToUpdate: (value: ExploreData) => {}, 
    loadPage: (num: number) => {} 
}

type SearchState = {
    searchValue: string
    isSearching: boolean
}

type SearchAction = SearchUpdateAction | SearchResetAction 

const initialSearchState: SearchState = {
    searchValue: '',
    isSearching: false
}

const searchReducer = (state: SearchState, action: SearchAction) => {
    switch (action.type) {
        case 'typing':
            return {searchValue: action.payload, isSearching: true }
        case 'reset':
            return initialSearchState
        default:
            return state
    }
}

export const Explore = () => {
    const [iiif_url, set_iiif_url] = useState<string>()
    const [artworks, setArtworks] = useState<Artwork[]>()
    const [pagination, setPagination] = useState<PaginationData>(initialPaginationState)
    const [pageNumber, setPageNumber] = useState(1)
    const [expandedId, setExpandedId] = useState(0)

    const [searchState, searchDispatch] = useReducer(searchReducer, initialSearchState)

    const loadPage = (num: number) => {
        setPageNumber(num)
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
                        itemsToUpdate: refreshData,
                        loadPage: loadPage,
            })
    }

    const expandItem = (id: number) => {
        setExpandedId(id)
    }

    useEffect(() => {
        const url = `https://api.artic.edu/api/v1/artworks?
                    fields=id,image_id,title,artist_title,[term][is_public_domain}=true,[has_not_been_viewed_much]=false&page=${pageNumber}&limit=${24}`
        axios.get(url)
        .then((res) => {
            refreshData(res.data)
        }).catch(error => {
            console.error('Error:', error)
        })
        // eslint-disable-next-line
    },[pageNumber])

    useEffect(() => {
        console.log(searchState.searchValue)
        if (searchState.searchValue.length < 1) {
            searchDispatch({type: 'reset'})
        } 
    }, [searchState.searchValue])

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        searchDispatch({type: 'typing', payload: event.target.value}) 
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [artworks])

    return(
        <>
            {
                expandedId > 0 &&
                <PiecePage expandItem={expandItem} expandedId={expandedId} iiif_url={iiif_url as string} />
            }
            { expandedId === 0 &&
                <div className={`${ expandedId > 0 ? ' hidden' : ' flex' } explore-view relative bg-coffee text-cream h-full w-screen flex-col gap-10 items-center`}>
                    <span className='radial-gradient w-screen h-64 fixed top-0 '/>
                    <section className={`header-group ${searchState.isSearching ? 'h-screen bg-coffee/80 backdrop-blur-md' : 'h-min coffee-gradient'} sticky top-0 pt-6 sm:pt-12 pb-6 px-6 lg:px-12 w-full z-10 max-w-full mt-12= flex flex-col gap-4 items-center`}>
                        <div className="header h-min flex flex-col gap-3 text-left sm:text-center items-center">
                            <h1 className=" text-[40px] md:text-[56px] leading-[40px] md:leading-[56px] font-bold tracking-tighter ">Explore to your hearts content.</h1>
                            <p className=" text-lg md:text-xl leading-7 md:leading-9 text-cream/70 max-w-2xl">Discover popular artworks, by famous artists recent and from history.</p>
                        </div>
                        <span className='relative w-full max-w-lg px-0 sm:px-6 bg-green-300/'>
                            <img src={SearchIcon} alt='search icon'
                                className='absolute top-3.5 left-3 sm:left-9'/>
                            <input type='text' 
                                placeholder="Search by artist name, title, keywords."
                                className='placeholder:text-cream/60 p-3 pl-11 rounded-xl bg-cream/5 w-full focus:outline-none focus:ring focus:ring-cream'
                                value={searchState.searchValue}
                                onChange={handleSearchChange} />
                                { searchState.searchValue.length > 0 &&
                                    <button onClick={() => searchDispatch({type: 'reset'})}
                                    className='absolute top-3.5 right-3 sm:right-9 flex items-center justify-center w-5 h-5 rounded-lg bg-cream/100 border border-cream/50 hover:rotate-90 hover:cursor-pointer hover:scale-110 transition duration-100 ease-out'>
                                    <img src={clearIcon} alt='claer-icon' />
                                </button>}
                        </span>
                        <div className={`${searchState.isSearching ? 'flex' : 'hidden'} w-full max-w-md`}>
                            <ExploreResults iiif_url={`${iiif_url}`} expandItem={expandItem} value={searchState.searchValue}/>
                        </div>
                    </section>
                    <section className='flex flex-col gap-8 items-center px-6 lg:px-12'>
                        <span className='py-1 px-3 rounded-2xl border border-cream/20 text-sm w-fit'>Popular</span>
                        <div className='flex flex-wrap justify-evenly items-center gap-x-14 gap-y-4 transition-all duration-300 delay-1000 ease-out'>
                            {artworks && artworks.map((piece, index) => {
                            return piece.image_id !==null && 
                            <ExploreItem 
                                    key={piece.id} 
                                    expand={expandItem} 
                                    size={index % 2} piece={piece} index={index}
                                    iiif_url={iiif_url ? iiif_url : ''}/>
                            })}
                        </div>
                    </section>
                    <Pagination paginationData={pagination}/>
                </div>
            }
        </>
    )
}