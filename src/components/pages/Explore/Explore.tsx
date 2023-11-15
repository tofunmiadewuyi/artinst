import { Otherworks, ExploreData, Piece } from '../../../types'
import { ExploreItem } from './ExploreItem'
import { Artwork } from '../Landing/Landing'
import { useEffect, useState } from 'react'
import { Pagination, PaginationData } from './Pagination'
import { TextButton, TextButtonWithIconBefore } from '../../Button'
import { Chip } from '../../Chip'
import SearchIcon from '../../icons/search.svg'
import dimensionsIcon from '../../icons/dimensions.svg'
import artistIcon from '../../icons/artist.svg'
import axios from 'axios'
import '../../../index.css'

export const Explore = () => {
    const [iiif_url, set_iiif_url] = useState<string>()
    const [artworks, setArtworks] = useState<Artwork[]>()
    const [pagination, setPagination] = useState<PaginationData>({prev:'', next:'', currentPage: 1, totalPages: 1, itemsToUpdate: (value: ExploreData) => {}, loadPage: (num: number) => {} })
    const [expanded, setExpanded] = useState(0)
    const [otherWorks, setOTherWorks] = useState<Otherworks[]>()
    const [pieceDetails, setPieceDetails] = useState({} as Piece)
    const [showMore, setShowMore] = useState(false)
    const [pageNumber, setPageNumber] = useState(7)
    const [searchValue, setSearchValue] = useState('')
 
    const paginatedItems = (value:ExploreData) => {
        refreshData(value)
    }

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
                        itemsToUpdate: paginatedItems,
                        loadPage: loadPage,
            })
    }

    const expandItem = (id: number) => {
        getExploreItemDetails(id)
        setExpanded(id)
    }

    useEffect(() => {
        const url = `https://api.artic.edu/api/v1/artworks?fields=id,image_id,title,artist_title,[term][is_public_domain}=true,[has_not_been_viewed_much]=false&page=${pageNumber}&limit=${24}`
        axios.get(url)
        .then((res) => {
            refreshData(res.data)
        }).catch(error => {
            console.error('Error:', error)
        })
        // eslint-disable-next-line
    },[pageNumber])


    const getExploreItemDetails = (id: number) => {
        const url = `https://api.artic.edu/api/v1/artworks/${id}?
                    fields=title,image_id,credit_line,artist_id,artist_title,dimensions,description,classification_titles,artwork_type_title,copyright_notice,style_titles,thumbnail`
        axios.get(url)
        .then(res => {
            const data = res.data.data
            setPieceDetails({
                title: data.title,
                imageUrl: `${iiif_url}/${data.image_id}/full/843,/0/default.jpg`, 
                creditLine: data.credit_line,
                artistId: data.artist_id,
                artist: data.artist_title,
                dimensions: data.dimensions,
                description: data.description,
                classificationTitles: data.classification_titles, //Array
                artworkType: data.artwork_type_title,
                copyrightNotice: data.copyright_notice,
                styleTitles: data.style_titles,
                thumbnail: data.thumbnail
            })
            getOtherWorks(data.artist_title)
        })
        .catch(err => {
            console.error("Error:", err)
        })  
    }

    const getOtherWorks = (name: string) => {
        const encodedName = encodeURIComponent(name)
        const url = `https://api.artic.edu/api/v1/artworks/search?q=${encodedName}`
        axios.get(url)
        .then(res => {
            const linkArray: string[] = []
            for (let i = 0; i < 5; i++) {
                linkArray.push(res.data.data[i].api_link)
            }

        // Create an array of promises for each axios.get call
        const promises = linkArray.map(link => axios.get(link));
      
        // Use Promise.all to wait for all promises to resolve
        Promise.all(promises)
          .then(responses => {
            const works = responses.map((res) => ({
              artist: res.data.data.artist_title,
              image_url: `${res.data.config.iiif_url}/${res.data.data.image_id}/full/420,/0/default.jpg`,
              title: res.data.data.title,
              id: res.data.data.id
            }));
            setOTherWorks(works);
          })
          .catch(error => {
            console.error('Error fetching other works:', error);
          });
            console.log('called getOtherWorks')
        })
    }

    const backToExplore = () => {
        setExpanded(0)
        setPieceDetails({
            title: '',
            imageUrl: '',
            creditLine: '',
            artistId: 0,
            artist: '',
            dimensions: '',
            description: '',
            classificationTitles: [] ,
            artworkType: '',
            copyrightNotice: '',
            styleTitles: [],
            thumbnail:  {alt_text: ''}
        })
        setOTherWorks(undefined)
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value)
    }

    const handleSearchEnter = () => {

    }

    return(
        <>
                <div className={`${expanded > 0 ? 'flex' : 'hidden'} expanded-view page absolute w-screen h-screen bg-coffee p-7 sm:p-12 lg:p-16 text-left text-white`}>
                        <span className='absolute top-0 z-0 left-0 h-screen overflow-hidden flex items-center'>
                            <img src={pieceDetails.imageUrl} className='w-screen h-auto ' alt=''/>
                        </span>
                        <span className='absolute top-0 left-0 h-screen w-screen backdrop-blur-2xl bg-coffee/50'/>
                        <div className={`content relative overscroll-none= flex flex-col-reverse lg:flex-row z-10 gap-6 sm:gap-8 xl:gap-16 ${showMore ? '' : 'justify-end'} lg:justify-between w-full lg:h-full overflow-auto `}>
                            <div className="info w-full lg:w-3/6 flex flex-col gap-3 sm:gap-8">
                                <TextButtonWithIconBefore label='Explore' action={backToExplore} state='active'/>
                                <div className="details flex flex-col md:flex-row lg:flex-col gap-4">
                                    <div className="piece-details flex flex-1 flex-col gap-4">
                                        <div className="title-group flex flex-col gap-2">
                                            <h2 className="title text-3xl font-semibold leading-8">{pieceDetails?.title}</h2>
                                            <p className="credit-line text-lg leading-6">{pieceDetails?.creditLine}</p>
                                        </div>
                                        <div className="support flex flex-col gap-2 leading-6">
                                            <p className="artist text-xl font-semibold inline-flex ">
                                                {pieceDetails.artist && <img src={artistIcon} className=' mr-1 opacity-80' alt='artist-icon'/>}
                                                {pieceDetails.artist}</p>
                                            <p className=" text-sm leading-6 text-white/70">{pieceDetails.copyrightNotice}</p>
                                            <div className="dimensions flex gap-1 text-sm leading-6 text-white/70">
                                                { pieceDetails.dimensions && <img src={dimensionsIcon} alt='dimensions-icon'/>}
                                                {pieceDetails.dimensions}
                                            </div>
                                        </div>
                                        <div className="pills flex gap-3 flex-wrap">
                                            { pieceDetails.classificationTitles && pieceDetails?.classificationTitles.map((classification, index) => {
                                                return <Chip key={index} label={classification}/>
                                            })}
                                            { pieceDetails.styleTitles && pieceDetails?.styleTitles.map((style, index) => {
                                                return <Chip key={index} label={style}/>
                                            })}
                                        </div>
                                    </div> 
                                    <div className='description flex-1'>
                                        <div className={`${showMore ? 'line-clamp-none' : 'line-clamp-3 '} description-content text-sm leading-6 text-white/70 transition ease-out duration-500`}
                                            dangerouslySetInnerHTML={{ __html: pieceDetails?.description}}>
                                        </div>
                                        {pieceDetails.description && <TextButton label={`${showMore ? 'less' : 'more...'}`} action={() => setShowMore(prev => !prev)} state='active'/>}
                                    </div>
                                    
                                </div>
                                <div className='otherworks hidden lg:flex flex-col gap-3 flex-1'>
                                    { otherWorks && <p className='text-xs text-white/70 font-semibold'>Similar to "<em>{pieceDetails.title}"</em></p>}
                                    <div className=' overflow-y-visible overflow-x-auto max-w-lg xl:max-w-full max-h-full flex gap-6'>
                                            {otherWorks?.map((work) => {
                                                return (
                                                <div key={work.id} onClick={() => expandItem(work.id)} className=' flex items-center shrink-0 w-2/5 xl:max-w-[120px] xl:h-full hover:scale-105 transition ease-out hover:cursor-pointer'>
                                                <img src={work.image_url} alt={''}/>
                                                </div>
                                                )
                                            })}
                                        
                                    </div>
                                </div>
                            </div>
                            {pieceDetails.imageUrl && 
                                <div className=" lg:sticky top-0 image w-fit flex justify-center items-start ">
                                    <img src={pieceDetails.imageUrl} alt={pieceDetails.thumbnail && pieceDetails.thumbnail.alt_text} className= 'block sm:w-4/6 md:w-3/6 lg:w-fit lg:h-full mx-auto'/>
                                </div>
                                }
                        </div>
                    </div>
                
                <div className={`${ expanded > 0 ? ' hidden' : ' flex' } explore-view relative bg-coffee text-cream h-full w-screen flex-col gap-10 items-center`}>
                    <span className='radial-gradient w-screen h-64 fixed top-0 '/>
                    <section className="relativelg: sticky top-0 pt-12 pb-6 coffee-gradient h-min w-full z-10 max-w-full header mt-12= flex flex-col gap-4 items-center">
                        <div className=" h-min flex flex-col gap-3 text-left sm:text-center items-center">
                            <h1 className=" text-[40px] md:text-[56px] leading-[40px] md:leading-[56px] font-bold tracking-tighter ">Explore to your hearts content.</h1>
                            <p className=" text-lg md:text-xl leading-7 md:leading-9 text-cream/60 max-w-2xl">Discover popular artworks, by famous artists recent and from history.</p>
                        </div>
                        <span className='relative w-full max-w-lg px-0 sm:px-6 bg-green-300/'>
                            <img src={SearchIcon} alt='search icon'
                                className='absolute top-3.5 left-3 sm:left-9'/>
                            <input type='text' 
                                placeholder="Search by artist name, title, keywords."
                                className='placeholder:text-cream/50 p-3 pl-11 rounded-xl bg-cream/5 w-full focus:outline-none focus:ring focus:ring-cream'
                                value={searchValue}
                                onChange={handleSearchChange} 
                                onKeyDown={handleSearchEnter}/>
                        </span>
                    </section>
                    <section className='flex flex-col gap-8 items-center px-6 lg:px-12'>
                        <span className='py-1 px-3 rounded-2xl border border-cream/20 text-sm w-fit'>Popular</span>
                        <div className='flex flex-wrap justify-around items-center gap-x-14 gap-y-4'>
                            {artworks && artworks.map((piece, index) => {
                            return piece.image_id !==null && 
                            <ExploreItem 
                                    key={piece.id} 
                                    expand={expandItem} 
                                    size={index % 2} piece={piece} 
                                    iiif_url={iiif_url ? iiif_url : ''}/>
                            })}
                        </div>
                    </section>
                    <Pagination paginationData={pagination}/>
                </div>
            
        </>
    )
}