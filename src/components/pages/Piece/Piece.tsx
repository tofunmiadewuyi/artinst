import dimensionsIcon from './../../icons/dimensions.svg'
import { Chip } from '../../Chip'
import defaultImage from '../Landing/images/artwork.png'
import { useContext, useEffect, useState } from 'react'
import { TextButton, TextButtonWithIconBefore } from '../../Button'
import { NavContext } from "../../../App";

export const Piece = () => {

    const changePage = useContext(NavContext)

    const [image, setImage] = useState(defaultImage)

    const handleExploreClick = () => {
        changePage('Explore')
    }

    useEffect(() => {
        setImage('https://smarthistory.org/wp-content/uploads/2021/04/StarryNightFull.jpg')
    },[])

    return (
        <div className="page absolute top-0 left-0 w-screen h-screen flex bg-coffee p-7 sm:p-12 lg:p-16 text-left text-white">
            <span className='absolute top-0 z-0 left-0 h-screen overflow-hidden flex items-center'>
                <img src={image} className='w-screen h-auto ' alt=''/>
            </span>
            <span className='absolute top-0 left-0 h-screen w-screen backdrop-blur-xl bg-black/40'/>
            <div className="content flex flex-col-reverse lg:flex-row z-10 gap-6 sm:gap-8 xl:gap-16 w-full lg:h-full overflow-auto ">
                <div className="info w-full lg:w-3/6 flex flex-col gap-3 sm:gap-8">
                    <TextButtonWithIconBefore label='Explore' action={handleExploreClick} state='active'/>
                    <div className="details flex flex-col md:flex-row lg:flex-col gap-4">
                        <div className="piece-details flex flex-col gap-4">
                            <div className="title flex flex-col gap-2">
                                <h2 className="text-3xl font-semibold leading-8">Nude with a Pitcher</h2>
                                <p className=" text-lg leading-6">Gift of Mary and Leigh block.</p>
                            </div>
                            <div className="support flex flex-col gap-2 leading-6">
                                <p className=" text-xl font-semibold ">Pablo Picasso</p>
                                <p className=" text-sm leading-6 text-white/70">Spanish, active France, 1881–1973</p>
                                <div className="flex gap-1 text-sm leading-6 text-white/70"><img src={dimensionsIcon} alt='dimensions-icon'/>100.6 × 81 cm (39 5/8 × 31 7/8 in.)</div>
                            </div>
                            <div className="pills flex gap-3">
                                <Chip label='Modern Art'/>
                                <Chip label='Painting'/>
                                <Chip label='Oil on Canvas'/>
                            </div>
                        </div> 
                        <div className='description'>
                            <div className='description-content text-sm leading-6 text-white/70 line-clamp-2- lg:line-clamp-3'>
                                This canvas is Pierre-Auguste Renoir’s earliest painting of a laundress, a prevalent figure in the visual and literary culture of middle-class France in the 19th century. The model for the figure was Nini Lopez, a resident of Montmartre, the Parisian quarter to which Renoir moved in the summer of 1876. Lopez was characterized by writer and art critic Georges Rivière as the ideal model, for she was “punctual, serious, [and] discreet.”
                            </div>
                            <TextButton label='more...' action={console.log} state='active'/>
                        </div>
                        
                    </div>
                    <div className='hidden lg:flex flex-col gap-3 flex-1'>
                        <p className='text-xs text-white/70 font-semibold'>Others by Pablo Picasso</p>
                        <div className=' overflow-x-scroll max-w-lg xl:max-w-full max- h-full- flex gap-6'>
                            <div className='bg-cream/10 shrink-0 w-2/5 xl:max-w-[192px] xl:h-full '><img src={image} alt=''/></div>
                            <div className='bg-cream/10 shrink-0 w-2/5 xl:max-w-[192px] xl:h-full'><img src={image} alt=''/></div>
                            <div className='bg-cream/10 shrink-0 w-2/5 xl:max-w-[192px] xl:h-full'><img src={image} alt=''/></div>

                        </div>
                    </div>
                </div>
                <div className="image w-fit flex justify-center items-start pt-12- ">
                    <img src={image} alt='art piece' className= 'block sm:w-4/6 md:w-3/6 lg:w-fit lg:h-full mx-auto'/>
                </div>
            </div>
        </div>
    )
}