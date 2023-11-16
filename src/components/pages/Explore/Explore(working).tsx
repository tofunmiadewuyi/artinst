export const Dummy = () => {}


// import { Otherworks, ExploreData, Piece } from '../../../types'
// import { ExploreItem } from './ExploreItem'
// import { Artwork } from '../Landing/Landing'
// import { useEffect, useReducer, useState } from 'react'
// import { Pagination, PaginationData } from './Pagination'
// import { TextButton, TextButtonWithIconBefore } from '../../Button'
// import { Chip } from '../../Chip'
// import SearchIcon from '../../icons/search.svg'
// import dimensionsIcon from '../../icons/dimensions.svg'
// import artistIcon from '../../icons/artist.svg'
// import clearIcon from '../../icons/clear.svg'
// import axios from 'axios'
// import '../../../index.css'
// import { ExploreResults } from './SearchResults'


// const initialPaginationState = {
//     prev:'',
//     next:'', 
//     currentPage: 1, 
//     totalPages: 1, 
//     itemsToUpdate: (value: ExploreData) => {}, 
//     loadPage: (num: number) => {} 
// }

// const emptyPieceDetails : Piece = {
//     title: '',
//     imageUrl: '',
//     creditLine: '',
//     artistId: 0,
//     artist: '',
//     dimensions: '',
//     description: '',
//     classificationTitles: [] ,
//     artworkType: '',
//     copyrightNotice: '',
//     styleTitles: [],
//     thumbnail:  {alt_text: ''}
// }

// type SearchState = {
//     searchValue: string
//     isSearching: boolean
// }

// type SearchAction = {
//     type: string
//     payload: string | boolean
// }

// const initialSearchState: SearchState = {
//     searchValue: '',
//     isSearching: false
// }

// const searchReducer = (state: SearchState, action: SearchAction) => {
//     switch (action.type) {
//         case 'typing':
//             return {...state, searchValue: action.payload as string}
//         case 'searching':
//             return {...state, isSearching: true}
//         default:
//             return state
//     }
// }

// export const Explore = () => {
//     const [iiif_url, set_iiif_url] = useState<string>()
//     const [artworks, setArtworks] = useState<Artwork[]>()
//     const [pagination, setPagination] = useState<PaginationData>(initialPaginationState)
//     const [expanded, setExpanded] = useState(0)
//     const [otherWorks, setOTherWorks] = useState<Otherworks[]>()
//     const [pieceDetails, setPieceDetails] = useState(emptyPieceDetails)
//     const [showMore, setShowMore] = useState(false)
//     const [pageNumber, setPageNumber] = useState(7)
//     const [searchValue, setSearchValue] = useState('')
//     const [isSearching, setIsSearching] = useState(false)
//     const [isShowing, setIsShowing] = useState('page')

//     const [searchState, searchDispatch] = useReducer(searchReducer, initialSearchState)
 

//     const loadPage = (num: number) => {
//         setPageNumber(num)
//     }

//     const refreshData = (data: ExploreData) => {
//         const iiif_url = data.config.iiif_url
//             set_iiif_url(iiif_url)
//             const resultsArray =  data.data
//             setArtworks(resultsArray)
//             setPagination({
//                         prev: data.pagination.prev_url,
//                         next: data.pagination.next_url,
//                         currentPage: data.pagination.current_page,
//                         totalPages: data.pagination.total_pages,
//                         itemsToUpdate: refreshData,
//                         loadPage: loadPage,
//             })
//     }

//     const expandItem = (id: number) => {
//         getExploreItemDetails(id)
//         setExpanded(id)
//         setIsShowing('piece')
//     }

//     useEffect(() => {
//         const url = `https://api.artic.edu/api/v1/artworks?fields=id,image_id,title,artist_title,[term][is_public_domain}=true,[has_not_been_viewed_much]=false&page=${pageNumber}&limit=${24}`
//         axios.get(url)
//         .then((res) => {
//             refreshData(res.data)
//         }).catch(error => {
//             console.error('Error:', error)
//         })
//         // eslint-disable-next-line
//     },[pageNumber])


//     const getExploreItemDetails = (id: number) => {
//         const url = `https://api.artic.edu/api/v1/artworks/${id}?
//                     fields=title,image_id,credit_line,artist_id,artist_title,dimensions,description,classification_titles,artwork_type_title,copyright_notice,style_titles,thumbnail`
//         axios.get(url)
//         .then(res => {
//             const data = res.data.data
//             setPieceDetails({
//                 title: data.title,
//                 imageUrl: `${iiif_url}/${data.image_id}/full/843,/0/default.jpg`, 
//                 creditLine: data.credit_line,
//                 artistId: data.artist_id,
//                 artist: data.artist_title,
//                 dimensions: data.dimensions,
//                 description: data.description,
//                 classificationTitles: data.classification_titles, //Array
//                 artworkType: data.artwork_type_title,
//                 copyrightNotice: data.copyright_notice,
//                 styleTitles: data.style_titles,
//                 thumbnail: data.thumbnail
//             })
//             getOtherWorks(data.artist_title)
//         })
//         .catch(err => {
//             console.error("Error:", err)
//         })  
//     }

//     const getOtherWorks = (name: string) => {
//         const encodedName = encodeURIComponent(name)
//         const url = `https://api.artic.edu/api/v1/artworks/search?q=${encodedName}`
//         axios.get(url)
//         .then(res => {
//             const linkArray: string[] = []
//             for (let i = 0; i < 5; i++) {
//                 linkArray.push(res.data.data[i].api_link)
//             }

//         // Create an array of promises for each axios.get call
//         const promises = linkArray.map(link => axios.get(link));
      
//         // Use Promise.all to wait for all promises to resolve
//         Promise.all(promises)
//           .then(responses => {
//             const works = responses.map((res) => ({
//               artist: res.data.data.artist_title,
//               image_url: `${res.data.config.iiif_url}/${res.data.data.image_id}/full/420,/0/default.jpg`,
//               title: res.data.data.title,
//               id: res.data.data.id
//             }));
//             setOTherWorks(works);
//           })
//           .catch(error => {
//             console.error('Error fetching other works:', error);
//           });
//             console.log('called getOtherWorks')
//         })
//     }

//     const backToExplore = () => {
//         setExpanded(0)
//         setPieceDetails(emptyPieceDetails)
//         setOTherWorks(undefined)
//         setIsShowing('page')
//     }

//     useEffect(() => {
//         console.log(searchValue)
//         if (searchValue.length > 0) {
//             setIsSearching(true)
//         } else {
//             setIsSearching(false)
//         }
//     }, [searchValue])

//     const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchValue(event.target.value) 
//     }

//     return(
//         <>
//             { isShowing === 'piece' &&
//                 <div className={`${expanded > 0 ? 'flex' : 'hidden'} expanded-view page absolute w-screen h-screen bg-coffee p-7 sm:p-12 lg:p-16 text-left text-white`}>
//                         <span className='absolute top-0 z-0 left-0 h-screen overflow-hidden flex items-center'>
//                             <img src={pieceDetails.imageUrl} className='w-screen h-auto ' alt=''/>
//                         </span>
//                         <span className='absolute top-0 left-0 h-screen w-screen backdrop-blur-2xl bg-coffee/50'/>
//                         <div className={`content relative overscroll-none= flex flex-col-reverse lg:flex-row z-20 gap-6 sm:gap-8 xl:gap-16 lg:justify-between w-full lg:h-full overflow-auto `}>
//                             <div className="info w-full lg:w-3/6 flex flex-col gap-3 sm:gap-8">
//                                 <TextButtonWithIconBefore label='Explore' action={backToExplore} state='active'/>
//                                 <div className="details flex flex-col md:flex-row lg:flex-col gap-4">
//                                     <div className="piece-details flex flex-1 flex-col gap-4">
//                                         <div className="title-group flex flex-col gap-2">
//                                             <h2 className="title text-3xl font-semibold leading-8">{pieceDetails?.title}</h2>
//                                             <p className="credit-line text-lg leading-6">{pieceDetails?.creditLine}</p>
//                                         </div>
//                                         <div className="support flex flex-col gap-2 leading-6">
//                                             <p className="artist text-xl font-semibold inline-flex ">
//                                                 {pieceDetails.artist && <img src={artistIcon} className=' mr-1 opacity-80' alt='artist-icon'/>}
//                                                 {pieceDetails.artist}</p>
                                            
//                                             <div className="dimensions flex gap-1 text-sm leading-6 text-white/70">
//                                                 { pieceDetails.dimensions && <img src={dimensionsIcon} alt='dimensions-icon'/>}
//                                                 {pieceDetails.dimensions}
//                                             </div>
//                                             <p className=" text-sm leading-6 text-white/70">{pieceDetails.copyrightNotice}</p>
//                                         </div>
//                                         <div className="pills flex gap-3 flex-wrap">
//                                             { pieceDetails.classificationTitles && pieceDetails?.classificationTitles.map((classification, index) => {
//                                                 return <Chip key={index} label={classification}/>
//                                             })}
//                                             { pieceDetails.styleTitles && pieceDetails?.styleTitles.map((style, index) => {
//                                                 return <Chip key={index} label={style}/>
//                                             })}
//                                         </div>
//                                     </div> 
//                                     <div className='description flex-1'>
//                                         <div className={`${showMore ? 'line-clamp-none' : 'line-clamp-3 '} description-content text-sm leading-6 text-white/70 transition ease-out duration-500`}
//                                             dangerouslySetInnerHTML={{ __html: pieceDetails?.description}}>
//                                         </div>
//                                         {pieceDetails.description && <TextButton label={`${showMore ? 'less' : 'more...'}`} action={() => setShowMore(prev => !prev)} state='active'/>}
//                                     </div>
                                    
//                                 </div>
//                                 <div className='Otherworks flex lg:flex flex-col gap-3 flex-1'>
//                                     { otherWorks && <p className='text-xs text-white/70 font-semibold'>Similar to "<em>{pieceDetails.title}"</em></p>}
//                                     <div className=' overflow-y-visible overflow-x-auto max-w-lg xl:max-w-full max-h-full flex gap-6'>
//                                             {otherWorks?.map((work) => {
//                                                 return (
//                                                 <div key={work.id} onClick={() => expandItem(work.id)} className=' flex items-center shrink-0 w-2/5 xl:max-w-[120px] xl:h-full hover:scale-105 transition ease-out hover:cursor-pointer'>
//                                                 <img src={work.image_url} alt={''}/>
//                                                 </div>
//                                                 )
//                                             })}
                                        
//                                     </div>
//                                 </div>
//                             </div>
//                             {pieceDetails.imageUrl && 
//                                 <div className=" lg:sticky top-0 image w-fit flex justify-center items-start ">
//                                     <img src={pieceDetails.imageUrl} alt={pieceDetails.thumbnail && pieceDetails.thumbnail.alt_text} className= 'block sm:w-4/6 md:w-3/6 lg:w-fit lg:h-full mx-auto'/>
//                                 </div>
//                                 }
//                         </div>
//                     </div>
//                 }
//             { isShowing === 'page' &&
//                 <div className={`${ expanded > 0 ? ' hidden' : ' flex' } explore-view relative bg-coffee text-cream h-full w-screen flex-col gap-10 items-center`}>
//                     <span className='radial-gradient w-screen h-64 fixed top-0 '/>
//                     <section className={`header-group ${isSearching ? 'h-screen bg-coffee/80 backdrop-blur-md' : 'h-min coffee-gradient'} sticky top-0 pt-6 sm:pt-12 pb-6 px-6 lg:px-12 w-full z-10 max-w-full mt-12= flex flex-col gap-4 items-center`}>
//                         <div className="header h-min flex flex-col gap-3 text-left sm:text-center items-center">
//                             <h1 className=" text-[40px] md:text-[56px] leading-[40px] md:leading-[56px] font-bold tracking-tighter ">Explore to your hearts content.</h1>
//                             <p className=" text-lg md:text-xl leading-7 md:leading-9 text-cream/60 max-w-2xl">Discover popular artworks, by famous artists recent and from history.</p>
//                         </div>
//                         <span className='relative w-full max-w-lg px-0 sm:px-6 bg-green-300/'>
//                             <img src={SearchIcon} alt='search icon'
//                                 className='absolute top-3.5 left-3 sm:left-9'/>
//                             <input type='text' 
//                                 placeholder="Search by artist name, title, keywords."
//                                 className='placeholder:text-cream/50 p-3 pl-11 rounded-xl bg-cream/5 w-full focus:outline-none focus:ring focus:ring-cream'
//                                 value={searchValue}
//                                 onChange={handleSearchChange} />
//                                 { searchValue.length > 0 &&
//                                     <button onClick={() => setSearchValue('')}
//                                     className='absolute top-3.5 right-3 sm:right-9 flex items-center justify-center w-5 h-5 rounded-lg bg-cream/20 border border-cream/20 hover:bg-cream/40 hover:cursor-pointer hover:scale-110 transition duration-100 ease-out'>
//                                     <img src={clearIcon} alt='claer-icon' />
//                                 </button>}
//                         </span>
//                         <div className={`${isSearching ? 'flex' : 'hidden'} w-full max-w-md`}>
//                             <ExploreResults iiif_url={`${iiif_url}`} expandItem={expandItem} value={searchValue}/>
//                         </div>
//                     </section>
//                     <section className='flex flex-col gap-8 items-center px-6 lg:px-12'>
//                         <span className='py-1 px-3 rounded-2xl border border-cream/20 text-sm w-fit'>Popular</span>
//                         <div className='flex flex-wrap justify-around items-center gap-x-14 gap-y-4'>
//                             {artworks && artworks.map((piece, index) => {
//                             return piece.image_id !==null && 
//                             <ExploreItem 
//                                     key={piece.id} 
//                                     expand={expandItem} 
//                                     size={index % 2} piece={piece} 
//                                     iiif_url={iiif_url ? iiif_url : ''}/>
//                             })}
//                         </div>
//                     </section>
//                     <Pagination paginationData={pagination}/>
//                 </div>
//             }
//         </>
//     )
// }



// OLDER EXPLORE

// import SearchIcon from '../../icons/search.svg'
// import dimensionsIcon from '../../icons/dimensions.svg'
// import { ExploreItem } from './ExploreItem'
// import { Artwork } from '../Landing/Landing'
// import { useEffect, useState } from 'react'
// import { Pagination, PaginationData } from './Pagination'
// import axios from 'axios'
// import { Otherworks, Piece } from '../../../types'
// import { TextButton, TextButtonWithIconBefore } from '../../Button'
// import { Chip } from '../../Chip'

// export type ExploreData = {
//     config: {
//         iiif_url: string
//     }
//     data: []
//     pagination: {
//         prev_url: string
//         next_url: string
//         current_page: number
//         total_pages: number
//     }
// }

// export const Explore = () => {

//     const [iiif_url, set_iiif_url] = useState<string>()
//     const [artworks, setArtworks] = useState<Artwork[]>()
//     const [pagination, setPagination] = useState<PaginationData>({prev:'', next:'', currentPage: 1, totalPages: 1, itemsToUpdate: (value: ExploreData) => {} })
//     const [expanded, setExpanded] = useState(0)
//     const [otherWorks, setOTherWorks] = useState<Otherworks[]>()
//     const [pieceDetails, setPieceDetails] = useState({} as Piece)

//     const paginatedItems = (value:ExploreData) => {
//         refreshData(value)
//     }

//     const refreshData = (data: ExploreData) => {
//         const iiif_url = data.config.iiif_url
//             set_iiif_url(iiif_url)
//             const resultsArray =  data.data
//             setArtworks(resultsArray)
//             setPagination({
//                         prev: data.pagination.prev_url,
//                         next: data.pagination.next_url,
//                         currentPage: data.pagination.current_page,
//                         totalPages: data.pagination.total_pages,
//                         itemsToUpdate: paginatedItems
//             })
//     }

//     const expandItem = (id: number) => {
//         getExploreItemDetails(id)
//         setExpanded(id)
//     }

//     const setPieceInfo =  (works: Otherworks[]) => {
//         // setOTherWorks(works)
//     }

//     useEffect(() => {
//         const url = `https://api.artic.edu/api/v1/artworks?fields=id,image_id,title,artist_title,[term][is_public_domain}=true,[has_not_been_viewed_much]=false&page=3&limit=${24}`
//         axios.get(url)
//         .then((res) => {
//             refreshData(res.data)
//         }).catch(error => {
//             console.error('Error:', error)
//         })
//         // eslint-disable-next-line
//     },[])

//     const getExploreItemDetails = (id: number) => {
//         const url = `https://api.artic.edu/api/v1/artworks/${id}?
//                     fields=title,image_id,credit_line,artist_id,artist_title,dimensions,description,classification_titles,artwork_type_title,copyright_notice,style_titles,thumbnail`
//         axios.get(url)
//         .then(res => {
//             const data = res.data.data
//             setPieceDetails({
//                 title: data.title,
//                 imageUrl: `${iiif_url}/${data.image_id}/full/843,/0/default.jpg`, 
//                 creditLine: data.credit_line,
//                 artistId: data.artist_id,
//                 artist: data.artist_title,
//                 dimensions: data.dimensions,
//                 description: data.description,
//                 classificationTitles: data.classification_titles, //Array
//                 artworkType: data.artwork_type_title,
//                 copyrightNotice: data.copyright_notice,
//                 styleTitles: data.style_titles,
//                 thumbnail: data.thumbnail
//             })
//             // getOtherWorks(data.artist_title)
//         })
//         .catch(err => {
//             console.error("Error:", err)
//         })
        
//     }
    
//     const backToExplore = () => {
//         setExpanded(0)
//         setPieceDetails({
//             title: '',
//             imageUrl: '',
//             creditLine: '',
//             artistId: 0,
//             artist: '',
//             dimensions: '',
//             description: '',
//             classificationTitles: [] ,
//             artworkType: '',
//             copyrightNotice: '',
//             styleTitles: [],
//             thumbnail:  {alt_text: ''}
//         })
//     }

//     return(
//         <>
//             {
//                 expanded > 0 ? 
//                 <div className="expanded-view page absolute top-0 left-0 w-screen h-screen flex bg-coffee p-7 sm:p-12 lg:p-16 text-left text-white">
//                         <span className='absolute top-0 z-0 left-0 h-screen overflow-hidden flex items-center'>
//                             <img src={pieceDetails.imageUrl} className='w-screen h-auto ' alt=''/>
//                         </span>
//                         <span className='absolute top-0 left-0 h-screen w-screen backdrop-blur-xl bg-black/40'/>
//                         <div className="content overscroll-none flex flex-col-reverse lg:flex-row z-10 gap-6 sm:gap-8 xl:gap-16 lg:justify-between w-full lg:h-full overflow-auto ">
//                             <div className="info w-full lg:w-3/6 flex flex-col gap-3 sm:gap-8">
//                                 <TextButtonWithIconBefore label='Explore' action={backToExplore} state='active'/>
//                                 <div className="details flex flex-col md:flex-row lg:flex-col gap-4">
//                                     <div className="piece-details flex flex-col gap-4">
//                                         <div className="title-group flex flex-col gap-2">
//                                             <h2 className="title text-3xl font-semibold leading-8">{pieceDetails?.title}</h2>
//                                             <p className="credit-line text-lg leading-6">{pieceDetails?.creditLine}</p>
//                                         </div>
//                                         <div className="support flex flex-col gap-2 leading-6">
//                                             <p className="artist text-xl font-semibold ">{pieceDetails.artist}</p>
//                                             <p className=" text-sm leading-6 text-white/70">{pieceDetails.copyrightNotice}</p>
//                                             <div className="dimensions flex gap-1 text-sm leading-6 text-white/70"><img src={dimensionsIcon} alt='dimensions-icon'/>
//                                                 {pieceDetails.dimensions}
//                                             </div>
//                                         </div>
//                                         <div className="pills flex gap-3 flex-wrap">
//                                             { pieceDetails.classificationTitles && pieceDetails?.classificationTitles.map((classification, index) => {
//                                                 return <Chip key={index} label={classification}/>
//                                             })}
//                                             { pieceDetails.styleTitles && pieceDetails?.styleTitles.map((style, index) => {
//                                                 return <Chip key={index} label={style}/>
//                                             })}
//                                         </div>
//                                     </div> 
//                                     <div className='description'>
//                                         <div className='description-content text-sm leading-6 text-white/70 line-clamp-2- lg:line-clamp-3'
//                                             dangerouslySetInnerHTML={{ __html: pieceDetails?.description}}>
//                                         </div>
//                                         {pieceDetails.description && <TextButton label='more...' action={console.log} state='active'/>}
//                                     </div>
                                    
//                                 </div>
//                                 <div className='hidden lg:flex flex-col gap-3 flex-1'>
//                                     { otherWorks !== undefined && <p className='text-xs text-white/70 font-semibold'>Others by {pieceDetails.artist}</p>}
//                                     <div className=' overflow-x-scroll max-w-lg xl:max-w-full max-h-full flex gap-6'>
//                                         { otherWorks?.map((work) => {
//                                             return (
//                                                 <div key={work.id} className=' flex items-center shrink-0 w-2/5 xl:max-w-[120px] xl:h-full'>
//                                                     <img src={work.image_url} alt={`${work.title} artwork by ${work.artist}`}/>
//                                                 </div>
//                                             )
//                                         }) }
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="image w-fit flex justify-center items-start ">
//                                 <img src={pieceDetails.imageUrl} alt={pieceDetails.thumbnail && pieceDetails.thumbnail.alt_text} className= 'block sm:w-4/6 md:w-3/6 lg:w-fit lg:h-full mx-auto'/>
//                             </div>
//                         </div>
//                     </div>
//                 :
//                 <div className={`explore-view bg-coffee text-cream ${ expanded > 0 ? 'h-screen overflow-hidden' : 'h-full' }  w-screen flex flex-col gap-10 px-6 items-center lg:px-12`}>
//                     <section className="max-w-full h-min header mt-20 flex flex-col gap-6 items-center">
//                         <div className="flex flex-col gap-3 text-left sm:text-center items-center">
//                             <h1 className=" text-[56px] leading-[56px] font-bold tracking-tighter ">Explore to your hearts content.</h1>
//                             <p className="text-xl leading-9 text-cream/60 max-w-2xl">Discover popular artworks, by famous artists recent and from history. Curated by the Art Institute of Chicago</p>
//                         </div>
//                         <span className='relative w-full max-w-lg px-0 sm:px-6 bg-green-300/'>
//                             <img src={SearchIcon} alt='search icon'
//                                 className='absolute top-3.5 left-3 sm:left-9'/>
//                             <input type='text' placeholder="Search by artist name, title, keywords."
//                                 className='placeholder:text-cream/50 p-3 pl-11 rounded-xl bg-cream/5 w-full focus:outline-none focus:ring focus:ring-cream' />
//                         </span>
//                     </section>
//                     <section className='flex flex-col gap-8 items-center'>
//                         <span className='py-1 px-3 rounded-2xl border border-cream/20 text-sm w-fit'>Popular</span>
//                         <div className='flex flex-wrap justify-around items-center gap-x-14 gap-y-4'>
//                             {artworks && artworks.map((piece, index) => {
//                             return piece.image_id !==null && 
//                             <ExploreItem 
//                                     key={piece.id} 
//                                     expand={expandItem} 
//                                     size={index % 2} piece={piece} 
//                                     iiif_url={iiif_url ? iiif_url : ''}/>
//                             })}
//                         </div>
//                     </section>
//                     <Pagination paginationData={pagination}/>
//                 </div>
//             }
//         </>
//     )
// }