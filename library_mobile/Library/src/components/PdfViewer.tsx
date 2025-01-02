import React, { useEffect, useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Pdf from 'react-native-pdf';

type Props = {
    id: string;
    pdfUrl: string;
    initialPage?: number;
    setPage?: (page: number) => void;
}

const PdfViewer = (props: Props) => {
    const { id, pdfUrl, initialPage, setPage } = props;
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(initialPage || 1);
    const [progress, setProgress] = useState(0);


    const colorScheme = useColorScheme();


    useEffect(() => {
        if (initialPage && initialPage > 0 && initialPage <= pageCount) {
            setCurrentPage(initialPage);
        }
    }, [initialPage, pageCount]);





    return (
        <View className='flex-1'>
            <Pdf
                page={currentPage}
                trustAllCerts={false}
                source={{ uri: pdfUrl, cache: true }}
                onLoadComplete={async (numberOfPages) => {
                    try {
                        setPageCount(numberOfPages);
                        if (initialPage && initialPage <= numberOfPages) {
                            setCurrentPage(initialPage);
                        }
                    } catch (error) {
                        console.log('Error loading pdf:', error);
                    }
                }}
                onPageChanged={(page) => {
                    setPage && setPage(page);
                    const progress = (page / pageCount);
                    setProgress(progress);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#063F54' : '#fff' }}
                enablePaging={true}
            />
            <View className='justify-center items-center p-2 w-12 absolute right-0 top-0 h-full'>
                <View style={styles.progressBarWrapper}>
                    <ProgressBar
                        className='bg-gray-500 rounded-full w-full h-1'
                        color='#05CDFA'
                        progress={progress}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    progressBarWrapper: {
        transform: [{ rotate: '-270deg' }],
        width: 500,
        height: 50,
        left: -5,
    },
});

export default PdfViewer;
