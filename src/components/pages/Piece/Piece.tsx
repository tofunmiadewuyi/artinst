import dimensionsIcon from './../../icons/dimensions.svg'
import { Chip } from '../../Chip'
import { Key, useEffect, useReducer } from 'react'
import { TextButton, TextButtonWithIconBefore } from '../../Button'
import artistIcon from '../../icons/artist.svg'
import {Piece, Otherworks, ExpandAction, ToggleDescAction, UpdatePieceAction, UpdateOtherWorksAction } from '../../../types'
import axios from 'axios'

const emptyPieceDetails : Piece = {
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
}

type PieceState = {
    expanded: number
    otherWorks: Otherworks[]
    showMore: boolean
    pieceDetails: Piece
}

const initialPieceState: PieceState = {
    expanded: 0,
    otherWorks: [],
    showMore: false,
    pieceDetails: emptyPieceDetails
}

type PieceAction = ExpandAction | ToggleDescAction | UpdatePieceAction | UpdateOtherWorksAction

const pieceReducer = (state: PieceState, action: PieceAction) => {
    switch(action.type) {
        case 'expand':
            return {...state, expanded: action.payload}
        case 'toggleDesc':
            return {...state, showMore: !state.showMore}
        case 'update piece':
            return {...state, pieceDetails: action.payload}
        case 'clear otherworks':
            return {...state, otherWorks: initialPieceState.otherWorks}
        case 'update otherworks':
            return {...state, otherWorks: action.payload as Otherworks[]}
        default:
            return state
    }
}

type PiecePageProps = {
    expandItem: (id: number) => void
    expandedId: number
    iiif_url: string
}

export const PiecePage = ({ expandItem, iiif_url, expandedId}: PiecePageProps) => {

    const [pieceState, pieceDispatch] = useReducer(pieceReducer, initialPieceState)

    const backToExplore = () => {
        pieceDispatch({type: 'expand', payload: 0})
        pieceDispatch({type: 'update piece', payload: emptyPieceDetails})
        pieceDispatch({type: 'clear otherworks'})
        expandItem(0)
    }

    const getExploreItemDetails = (id: number) => {
        const url = `https://api.artic.edu/api/v1/artworks/${id}?
                    fields=title,image_id,credit_line,artist_id,artist_title,dimensions,description,classification_titles,artwork_type_title,copyright_notice,style_titles,thumbnail`
        axios.get(url)
        .then(res => {
            const data = res.data.data
            pieceDispatch({type: 'update piece', payload: {
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
                thumbnail: data.thumbnail,
            }})
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
            pieceDispatch({type: 'update otherworks', payload: works})
          })
          .catch(error => {
            console.error('Error fetching other works:', error);
          });
            console.log('called getOtherWorks')
        })
    }

    useEffect(() => {
        if (expandedId > 0) getExploreItemDetails(expandedId)
    }, [expandedId])

    useEffect(() => {
         console.log(pieceState.pieceDetails)
    }, [pieceState])

    return (
        <div className={`expanded-view flex page absolute w-screen h-screen bg-coffee p-7 sm:p-12 lg:p-16 text-left text-white`}>
                        <span className='absolute top-0 z-0 left-0 h-screen overflow-hidden flex items-center'>
                            <img src={pieceState.pieceDetails.imageUrl} className='w-screen h-auto ' alt=''/>
                        </span>
                        <span className='absolute top-0 left-0 h-screen w-screen backdrop-blur-2xl bg-coffee/50'/>
                        <div className={`content relative overscroll-none= flex flex-col-reverse lg:flex-row z-20 gap-6 sm:gap-8 xl:gap-16 lg:justify-between w-full lg:h-full overflow-auto `}>
                            <div className="info w-full lg:w-3/6 flex flex-col gap-8 sm:gap-8">
                                <TextButtonWithIconBefore label='Explore' action={backToExplore} state='active'/>
                                <div className="details flex flex-col md:flex-row lg:flex-col gap-4">
                                    <div className="piece-details flex flex-1 flex-col gap-4">
                                        <div className="title-group flex flex-col gap-2">
                                            <h2 className="title text-3xl font-semibold leading-8">{pieceState.pieceDetails.title}</h2>
                                            <p className="credit-line text-lg leading-6">{pieceState.pieceDetails.creditLine}</p>
                                        </div>
                                        <div className="support flex flex-col gap-2 leading-6">
                                            <p className="artist text-xl font-semibold inline-flex ">
                                                {pieceState.pieceDetails.artist && <img src={artistIcon} className=' mr-1 opacity-80' alt='artist-icon'/>}
                                                {pieceState.pieceDetails.artist}</p>
                                            
                                            <div className="dimensions flex gap-1 items-start text-sm leading-6 text-white/70">
                                                {pieceState.pieceDetails.dimensions && <img src={dimensionsIcon} alt='dimensions-icon' className=' mt-0.5'/>}
                                                {pieceState.pieceDetails.dimensions}
                                            </div>
                                            <p className=" text-sm leading-6 text-white/70">{pieceState.pieceDetails.copyrightNotice}</p>
                                        </div>
                                        <div className="pills flex gap-3 flex-wrap">
                                            {pieceState.pieceDetails.classificationTitles && pieceState.pieceDetails?.classificationTitles.map((classification: string, index: Key) => {
                                                return <Chip key={index} label={classification}/>
                                            })}
                                            {pieceState.pieceDetails.styleTitles && pieceState.pieceDetails?.styleTitles.map((style: string, index: Key) => {
                                                return <Chip key={index} label={style}/>
                                            })}
                                        </div>
                                    </div> 
                                    <div className='description flex-1'>
                                        <div className={`${pieceState.showMore ? 'line-clamp-none' : 'line-clamp-3 '} description-content text-sm leading-6 text-white/70 transition ease-out duration-500`}
                                            dangerouslySetInnerHTML={{ __html: pieceState.pieceDetails?.description}}>
                                        </div>
                                        {pieceState.pieceDetails.description && <TextButton label={`${pieceState.showMore ? 'less' : 'more...'}`} action={() => pieceDispatch({type: 'toggleDesc'})} state='active'/>}
                                    </div>
                                    
                                </div>
                                <div className='Otherworks flex lg:flex flex-col gap-3 flex-1'>
                                    { pieceState.otherWorks.length > 0 && <p className='text-xs text-white/70 font-semibold'>Similar to "<em>{pieceState.pieceDetails.title}"</em></p>}
                                    <div className=' overflow-y-visible overflow-x-auto max-w-lg xl:max-w-full max-h-full flex gap-6'>
                                            {pieceState.otherWorks?.map((work) => {
                                                return (
                                                <div key={work.id} onClick={() => expandItem(work.id)} className=' flex items-center shrink-0 w-2/5 xl:max-w-[120px] xl:h-full hover:scale-105 transition ease-out hover:cursor-pointer'>
                                                <img src={work.image_url} alt={''}/>
                                                </div>
                                                )
                                            })}
                                        
                                    </div>
                                </div>
                            </div>
                            {pieceState.pieceDetails.imageUrl && 
                                <div className="animated-image lg:sticky top-0 image w-fit flex justify-center items-start ">
                                    <img src={pieceState.pieceDetails.imageUrl} alt={pieceState.pieceDetails.thumbnail && pieceState.pieceDetails.thumbnail.alt_text} className= 'block sm:w-4/6 md:w-3/6 lg:w-fit lg:h-full mx-auto'/>
                                </div>
                                }
                        </div>
                    </div>
    )
}