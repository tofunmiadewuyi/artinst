import { useEffect, useState } from "react"
import { TextButton, TextButtonWithIconBefore } from '../../Button'
import { Chip } from '../../Chip'
import dimensionsIcon from './../../icons/dimensions.svg'
import axios from "axios";
import { Piece } from "../Piece/Piece";
import { Artwork } from "../Landing/Landing";


type ExploreItemProps = {
    expand: {
        expanded: number
        expandItem: (id: number) => void
    }
    size: number
    piece: {
        id: number
        artist_title: string
        image_id: string
        title: string
    }
    iiif_url: string
    pieceInfo: {
        otherWorks: Otherworks[] | undefined
        setPieceInfo:(works: Otherworks[]) => void
    }
}

type Piece = {
    title: string
    creditLine: string
    artistId: number
    artistDisplay: string
    dimensions: string
    description: string | TrustedHTML
    classificationTitles: [] //Array
    artworkType: string
    copyrightNotice: string
    styleTitles: []
    thumbnail: {alt_text: string}
}

export type Otherworks = {
    artist: string
    image_url: string
    id: number
    title: string
}

export const ExploreItem = ({expand, size, piece, pieceInfo, iiif_url}: ExploreItemProps) => {

    const id = piece.id
    const [imageUrl, setImageURL] = useState(`${iiif_url}/${piece.image_id}/full/843,/0/default.jpg` )
    const fallbackUrls = [`${iiif_url}/${piece.image_id}/full/420,/0/default.jpg`, `${iiif_url}/${piece.image_id}/full/210,/0/default.jpg`,];
    const [tryLoadingImage, setTryLoadingImage] = useState(true)
    const [urlIndex, setUrlIndex] = useState(0)
    const [pieceDetails, setPieceDetails] = useState({} as Piece)

    const handleImageError = () => {
          if (urlIndex < fallbackUrls.length) {
            setImageURL(fallbackUrls[urlIndex]);
            setUrlIndex(prev => prev + 1)
            console.log('tried another url')
          } else {
            console.log('stopping retry');
            setTryLoadingImage(false);
          }
    }

    const handleClick = () => {
        expand.expandItem(piece.id) 
    }

    const backToExplore = () => {
        expand.expandItem(0)
    }

    const getExploreItemDetails = (id: number) => {
        const url = `https://api.artic.edu/api/v1/artworks/${id}?
                    fields=title,credit_line,artist_display,artist_id,artist_title,dimensions,description,classification_titles,artwork_type_title,copyright_notice,style_titles,thumbnail`
        const urlall = `https://api.artic.edu/api/v1/artworks/${id}`
        axios.get(urlall)
        .then(res => {
            const data = res.data.data
            setPieceDetails({
                title: data.title,
                creditLine: data.credit_line,
                artistId: data.artist_id,
                artistDisplay: data.artist_display,
                dimensions: data.dimensions,
                description: data.description,
                //categoryTitles: data.category_titles, // Array
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
            for (let i = 0; i < 4; i++) {
                linkArray.push(res.data.data[i].api_link)
            }
            loadOtherWorks(linkArray)
        })
    }

    const loadOtherWorks = (links: string[]) => {
        
        let works: Otherworks[] = [];

        for(let i=0; i<links.length; i++) {
            const url = `${links[i]}?fields=id,image_id,title,artist_title`
            axios.get(url)
            .then(res => {
                works.push({
                    artist: res.data.data.artist_title,
                    image_url: `${res.data.config.iiif_url}/${res.data.data.image_id}/full/420,/0/default.jpg`,
                    title: res.data.data.title,
                    id: res.data.data.id
                })
            })
        }
        pieceInfo.setPieceInfo(works)
    }

    let otherWorks: Otherworks[] | undefined

    useEffect(() => {
           if (expand.expanded === id) {
            getExploreItemDetails(id)
            otherWorks = pieceInfo.otherWorks
           }

           console.log(otherWorks)
    },[expand.expanded])

    return(
        <>
            {
                expand.expanded === id ?
                <div className="expanded-view page absolute top-0 left-0 w-screen h-screen flex bg-coffee p-7 sm:p-12 lg:p-16 text-left text-white">
                    <span className='absolute top-0 z-0 left-0 h-screen overflow-hidden flex items-center'>
                        <img src={imageUrl} className='w-screen h-auto ' alt=''/>
                    </span>
                    <span className='absolute top-0 left-0 h-screen w-screen backdrop-blur-xl bg-black/40'/>
                    <div className="content overscroll-none flex flex-col-reverse lg:flex-row z-10 gap-6 sm:gap-8 xl:gap-16 lg:justify-between w-full lg:h-full overflow-auto ">
                        <div className="info w-full lg:w-3/6 flex flex-col gap-3 sm:gap-8">
                            <TextButtonWithIconBefore label='Explore' action={backToExplore} state='active'/>
                            <div className="details flex flex-col md:flex-row lg:flex-col gap-4">
                                <div className="piece-details flex flex-col gap-4">
                                    <div className="title-group flex flex-col gap-2">
                                        <h2 className="title text-3xl font-semibold leading-8">{pieceDetails?.title}</h2>
                                        <p className="credit-line text-lg leading-6">{pieceDetails?.creditLine}</p>
                                    </div>
                                    <div className="support flex flex-col gap-2 leading-6">
                                        <p className="artist text-xl font-semibold ">{piece.artist_title}</p>
                                        <p className=" text-sm leading-6 text-white/70">{pieceDetails.copyrightNotice}</p>
                                        <div className="dimensions flex gap-1 text-sm leading-6 text-white/70"><img src={dimensionsIcon} alt='dimensions-icon'/>
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
                                <div className='description'>
                                    <div className='description-content text-sm leading-6 text-white/70 line-clamp-2- lg:line-clamp-3'
                                        dangerouslySetInnerHTML={{ __html: pieceDetails?.description}}>
                                    </div>
                                    {pieceDetails.description && <TextButton label='more...' action={console.log} state='active'/>}
                                </div>
                                
                            </div>
                            <div className='hidden lg:flex flex-col gap-3 flex-1'>
                                { otherWorks !== undefined && <p className='text-xs text-white/70 font-semibold'>Others by {piece.artist_title}</p>}
                                <div className=' overflow-x-scroll max-w-lg xl:max-w-full max-h-full flex gap-6'>
                                    { otherWorks?.map((work) => {
                                        return (
                                            <div key={work.id} className=' flex items-center shrink-0 w-2/5 xl:max-w-[120px] xl:h-full'>
                                                <img src={work.image_url} alt={`${work.title} artwork by ${work.artist}`}/>
                                            </div>
                                        )
                                    }) }
                                </div>
                            </div>
                        </div>
                        <div className="image w-fit flex justify-center items-start ">
                            <img src={imageUrl} alt={pieceDetails.thumbnail && pieceDetails.thumbnail.alt_text} className= 'block sm:w-4/6 md:w-3/6 lg:w-fit lg:h-full mx-auto'/>
                        </div>
                    </div>
                </div>
    
                :
                <div onClick={handleClick} className="explore-view group flex flex-col gap-5 transition-all duration-700 ease-in-out hover:cursor-pointer">
                    <div className="bg-white p-2 group-hover:scale-105 transition duration-300 ease-out">
                    <img className={`${size === 1 ? 'w-64' : 'w-48'} object-cover `} 
                        src={imageUrl} 
                        alt='artwork'
                        onError={tryLoadingImage ? handleImageError : () => console.log('i tried all sizes man')}
                        />
                    </div>
                    <div className={`${size === 1 ? 'w-64' : 'w-44'} text-left opacity-0 group-hover:opacity-100 transition duration-300 ease-out`}>
                        <p className="text-cream font-semibold ">{piece.title}</p>
                        <p className=" text-cream/60">{piece.artist_title}</p>
                    </div>
                </div>
            }
        </>
    )
}