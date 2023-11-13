import { useEffect, useState } from "react"
import { OutlineButtonWithIconBefore,  OutlineButtonWithIconAfter } from "../../Button"
import axios from "axios"
import { ExploreData } from "./Explore"


type PaginationProps = {
    paginationData: PaginationData
}

export type PaginationData = {
    prev: string | undefined
    next: string | undefined
    currentPage: number
    totalPages: number
    itemsToUpdate: (value: ExploreData) => void
}

export const Pagination = ({paginationData}: PaginationProps) => {
    
    const [prevItemsToUpdate, setPrevItemsToUpdate] = useState<ExploreData | null>()
    const [nextItemsToUpdate, setNextItemsToUpdate] = useState<ExploreData | null>()
    const [currentPage, setCurrentPage] = useState(paginationData.currentPage)

    const prevAction = () => {
        if (prevItemsToUpdate) {
            paginationData.itemsToUpdate(prevItemsToUpdate)
        }
        console.log('prev action clicked')
    }

    const nextAction = () => {
        if (nextItemsToUpdate) {
            paginationData.itemsToUpdate(nextItemsToUpdate)
        }
        console.log('next action clicked')
    }

    useEffect(() => {
        //load prev items
        if (paginationData.prev != undefined) {
            axios.get(paginationData.prev)
        .then(res => {
            setPrevItemsToUpdate(res.data)
            console.log('prev items set')
        })
        } else {
            setPrevItemsToUpdate(undefined)
        }

        //load next items
        if (paginationData.next != undefined) {
            axios.get(paginationData.next)
        .then(res => {
            setNextItemsToUpdate(res.data)
            console.log('next items set')
        })
        } else {
            setNextItemsToUpdate(undefined)
        }

        //set current page
        setCurrentPage(paginationData.currentPage)

    }, [paginationData])




    return (
        <div className='flex gap-6 items-center mb-20'>
            <OutlineButtonWithIconBefore 
                state={prevItemsToUpdate != undefined ? 'active' : 'disabled'} 
                label="Prev" 
                action={prevAction} />
            <span className='text-cream/50'>Page {currentPage} of  {paginationData.totalPages}</span>
            <OutlineButtonWithIconAfter 
                state={nextItemsToUpdate != undefined ? 'active' : 'disabled'} 
                label="Next" 
                action={nextAction} />
        </div>
    )
}