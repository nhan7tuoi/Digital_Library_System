export interface IChapter {
    _id: string
    book: string
    title: string
    startPage: number
    pdfLink: string
    audioLink: string
}

export const defaultListChapter: IChapter[] = [
    {
        _id: '',
        book: '',
        title: '',
        startPage: 0,
        pdfLink: '',
        audioLink: ''
    }
]