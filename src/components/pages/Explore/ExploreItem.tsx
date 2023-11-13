import { useEffect, useState } from "react"

type ExploreItemProps = {
    size: number
    piece: {
        // id: number
        // title: string
        artist_title: string
        image_id: string
        title: string
    }
    iiif_url: string
}

export const ExploreItem = ({size, piece, iiif_url}: ExploreItemProps) => {

    const [imageUrl, setImageURL] = useState<string>()
    const [tryLoadingImage, setTryLoadingImage] = useState(true)
    const [urlIndex, setUrlIndex] = useState(0)
    const fallbackUrls = [
        `${iiif_url}/${piece.image_id}/full/420,/0/default.jpg`,
        `${iiif_url}/${piece.image_id}/full/210,/0/default.jpg`,
      ];

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {

          if (urlIndex < fallbackUrls.length) {
            setImageURL(fallbackUrls[urlIndex]);
            setUrlIndex(prev => prev + 1)
            console.log('tried another url')
          } else {
            console.log('stopping retry');
            setTryLoadingImage(false);
          }
    }

    useEffect(() => {
        const urlConcat = `${iiif_url}/${piece.image_id}/full/843,/0/default.jpg` 
        setImageURL(urlConcat)
    }, [])


    return(
        <div className="group flex flex-col gap-5 transition-all duration-700 ease-in-out hover:cursor-pointer">
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
    )
}