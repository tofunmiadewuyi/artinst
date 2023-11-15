export type Otherworks = {
    artist: string
    image_url: string
    id: number
    title: string
}

export type Piece = {
    title: string
    imageUrl: string
    creditLine: string
    artistId: number
    artist: string
    dimensions: string
    description: string | TrustedHTML
    classificationTitles: [] //Array
    artworkType: string
    copyrightNotice: string
    styleTitles: []
    thumbnail: {alt_text: string}
}

export type ExploreData = {
    config: {
        iiif_url: string
    }
    data: []
    pagination: {
        prev_url: string
        next_url: string
        current_page: number
        total_pages: number
    }
}