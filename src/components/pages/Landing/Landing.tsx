import { useContext, useEffect, useState } from "react";
import { FilledButton } from "../../Button";
import { Attribution } from "./attribution";
import axios from "axios";
import { NavContext } from "../../../App";

export type Artwork = {
    id: number
    image_id: string
    title: string 
    credit_line: string
    artist_title: string
}

export function Landing() {

    const changePage = useContext(NavContext)

    const [iiif_url, set_iiif_url] = useState<string>()
    const [artworks, setArtworks] = useState<Artwork[]>()
    const [showing, setShowing] = useState<Artwork>({ id: 0, image_id: '', title: '', credit_line: '', artist_title: '' })
    const [imageURL, setImageURL] = useState<string>()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const imageNumber = 10
        const url = `https://api.artic.edu/api/v1/artworks?fields=id,image_id,title,credit_line,artist_title,[term][is_public_domain}=true,[has_not_been_viewed_much]=false&page=1&limit=${imageNumber}`
       axios.get(url)
       .then(res => {
        const iiif_url = res.data.config.iiif_url
        set_iiif_url(iiif_url)
        const resultsArray =  res.data.data
        setArtworks(resultsArray)
       })
       .catch(error => console.error("Error:", error))
    }, [])

    useEffect(() => {
        let count = 0
        const intervalId = setInterval(() => {
            if (artworks && artworks.length > 0) {
                setShowing(artworks[count])
                count = (count + 1) % artworks.length
            }    
            // console.log(count)
        }, 10000)

        return () => clearInterval(intervalId)
    }, [artworks])

    useEffect(() => {
        if (showing.image_id !== '') { 
            const image_url = `${iiif_url}/${showing.image_id}/full/843,/0/default.jpg` 
            setIsVisible(false)
            setTimeout(() => {
                setImageURL(image_url)
            }, 500) 
        }
    }, [showing, iiif_url])

    useEffect(() => {
        setIsVisible(true)
    }, [imageURL])


    return (
        <div className="page w-screen h-screen bg-coffee  flex justify-center items-center px-8 xl:px-20">
            <span className="image-container absolute h-screen w-screen top-0 left-0 -z-1 overflow-hidden ">
                <img src={imageURL} alt='artwork as background' className={`h-full min-w-fit sm:h-auto sm:w-full ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 ease-in-out`}/>
            </span>
            <span className="image-tint absolute w-screen h-screen bg-black/40"/>
             <div className="content flex-col xl:flex-row flex items-baseline z-0">
                <section className=" flex-1 overflow-hidden">
                    <h1 className='ml-[-20px] text-left text-cream p-6 text-7xl tracking-tighter xl:text-[120px] xl:leading-[102px] font-bold'>
                        Explore <br/> 
                        Awesome <br/> 
                        Artworks.
                    </h1>
                </section>
                <section className="text-left flex flex-col gap-8 flex-1">
                    <p className="text-xl xl:text-2xl text-cream leading-9">Discover some of the greatest works of curated by the <em className="font-bold">Art Institute of Chicago</em>. Get in-depth and learn more about your favourites and most fascinating pieces.</p>
                    <FilledButton state='active' label='Get Started' action={() => changePage('Explore')}/>
                </section>
                <Attribution title={showing.title} artist={showing.artist_title} credit_line={showing.credit_line}/>
            </div>
        </div>
    )
}