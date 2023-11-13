import dimensionsIcon from './../../icons/dimensions.svg'
import { Chip } from '../../Chip'
import defaultImage from '../Landing/images/artwork.png'
import { ExploreItem } from '../Explore/ExploreItem'

export const Piece = () => {
    return (
        <div className="page w-screen h-screen flex bg-coffee p-6 sm:p-16 text-left text-white">
            <span className='absolute top-0 z-0 left-0 w-screen h-screen overflow-hidden flex items-center'>
                <img src={defaultImage} className='w-screen h-auto ' />
            </span>
            <span className='absolute top-0 left-0 h-screen w-screen backdrop-blur-xl bg-black/40'/>
            <div className="content bg-cream/20 flex flex-col-reverse md:flex-row z-10 gap-4 sm:gap-16 w-full h-full overflow-scroll ">
                <div className="info bg-yellow-400  w-full lg:w-3/6 flex flex-col gap-3 sm:gap-8">
                    <div>{'<-'} Explore </div>
                    <div className="details flex flex-col gap-6">
                        <div className="piece-details flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-3xl font-semibold leading-8">Nude with a Pitcher</h2>
                                <p className=" text-lg leading-6">Gift of Mary and Leigh block.</p>
                            </div>
                            <div className="support flex flex-col gap-2 leading-6">
                                <p className=" text-xl font-semibold ">Pablo Picasso</p>
                                <p className=" text-sm leading-6 text-white/70">Spanish, active France, 1881–1973</p>
                                <div className="flex gap-1 text-sm leading-6 text-white/70"><img src={dimensionsIcon} alt='dimensions-icon'/>100.6 × 81 cm (39 5/8 × 31 7/8 in.)</div>
                            </div>
                        </div>
                        <div className="pills flex gap-3">
                            <Chip label='Modern Art'/>
                            <Chip label='Painting'/>
                            <Chip label='Oil on Canvas'/>
                        </div>
                        <div className='description text-sm leading-6 text-white/70 line-clamp-3'>
                            This canvas is Pierre-Auguste Renoir’s earliest painting of a laundress, a prevalent figure in the visual and literary culture of middle-class France in the 19th century. The model for the figure was Nini Lopez, a resident of Montmartre, the Parisian quarter to which Renoir moved in the summer of 1876. Lopez was characterized by writer and art critic Georges Rivière as the ideal model, for she was “punctual, serious, [and] discreet.”
                        </div>
                    </div>
                    <div className='flex flex-1'>
                        <div className='bg-blue-400 overflow-x-scroll flex gap-6' style={{width: '100%', height: '100%'}}>
                            <div className='bg-blue-900 shrink-0 w-48 h-40 sm:h-full'>Art work 1</div>
                            <div className='bg-blue-900 shrink-0 w-48 h-full'>Art work 2</div>
                            <div className='bg-blue-900 shrink-0 w-48 h-full'>Art work 3</div>
                            <div className='bg-blue-900 shrink-0 w-96 h-full'>Art work 4</div>
                        </div>
                    </div>
                </div>
                <div className="image bg-green-500 flex-1- w-fit flex justify-center ">
                    <img src={defaultImage} alt='art piece' className= 'block m-auto'/>
                </div>
            </div>
        </div>
    )
}