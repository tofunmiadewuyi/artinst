import { useEffect, useState } from "react"
import { OutlineButtonWithIconBefore,  OutlineButtonWithIconAfter } from "../../Button"
import axios from "axios"
import { ExploreData } from '../../../types'


type PaginationProps = {
    paginationData: PaginationData
}

export type PaginationData = {
    prev: string | undefined
    next: string | undefined
    currentPage: number
    totalPages: number
    itemsToUpdate: (value: ExploreData) => void
    loadPage: (num: number) => void
}

export const Pagination = ({paginationData}: PaginationProps) => {
    
    const [prevItemsToUpdate, setPrevItemsToUpdate] = useState<ExploreData | null>()
    const [nextItemsToUpdate, setNextItemsToUpdate] = useState<ExploreData | null>()
    const [currentPage, setCurrentPage] = useState(paginationData.currentPage)
    const [inputValue, setInputValue] = useState<string>(JSON.stringify(paginationData.currentPage))
    const [inputFieldSize, setInputFieldSize] = useState(4)

    const prevAction = () => {
        if (prevItemsToUpdate) {
            paginationData.itemsToUpdate(prevItemsToUpdate)
        }
        // console.log('prev action clicked')
    }

    const nextAction = () => {
        if (nextItemsToUpdate) {
            paginationData.itemsToUpdate(nextItemsToUpdate)
        }
        // console.log('next action clicked')
    }

    useEffect(() => {
        //load prev items
        if (paginationData.prev !== undefined) {
            axios.get(paginationData.prev)
        .then(res => {
            setPrevItemsToUpdate(res.data)
        })
        } else {
            setPrevItemsToUpdate(undefined)
        }

        //load next items
        if (paginationData.next !== undefined) {
            axios.get(paginationData.next)
        .then(res => {
            setNextItemsToUpdate(res.data)
        })
        } else {
            setNextItemsToUpdate(undefined)
        }

        //set current page
        setCurrentPage(paginationData.currentPage)

    }, [paginationData])

    useEffect(() => {
        setInputValue(JSON.stringify(currentPage))
    }, [currentPage])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
        const inputLength = event.target.value.length
        if(inputLength === 1 || inputLength < 1) {
            setInputFieldSize(4)
        } else if (inputLength === 2) {
            setInputFieldSize(6)
        } else if (inputLength === 3) {
            setInputFieldSize(8)
        } else {
            setInputFieldSize(10)
        }
    }

    const handleInputBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(JSON.stringify(currentPage))
    }

    const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const number = parseFloat(inputValue)
        if (event.key === 'Enter' && !Number.isNaN(number)) {
           paginationData.loadPage(number)
           event.currentTarget.blur()
        }
    }


    return (
        <div className='flex gap-4 items-center mb-20'>
            <OutlineButtonWithIconBefore 
                state={prevItemsToUpdate !== undefined ? 'active' : 'disabled'} 
                label="Prev" 
                action={prevAction} />
            {/* <span className='text-cream/50'>Page {currentPage} of  {paginationData.totalPages}</span> */}
            <span className='text-cream/50 flex items-center gap-1'>
                Page 
                <input className={`text-cream bg-coffee w-${inputFieldSize} max-w-[2.5rem] text-center hover:border rounded-md hover:border-cream/50 focus:outline-cream/20`} 
                value={inputValue} 
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyPress}/>
                of  {paginationData.totalPages}</span>
            <OutlineButtonWithIconAfter 
                state={nextItemsToUpdate !== undefined ? 'active' : 'disabled'} 
                label="Next" 
                action={nextAction} />
        </div>
    )
}