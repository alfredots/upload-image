/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-return-await */
/* eslint-disable no-nested-ternary */
import { Button, Box, Flex } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { AxiosResponse } from 'axios';
import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
}

export default function Home(): JSX.Element {
  const fetchImages = async (params = null) => {
    const { pageParam } = params;
    const response = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });

    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // TODO AXIOS REQUEST WITH PARAM
    fetchImages,
    // TODO GET AND RETURN NEXT PAGE PARAM
    {
      getNextPageParam: (lastPage, pages) => {
        return pages[pages.length - 1].after || null;
      },
    }
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    const images = data?.pages.map(page => page.data).flat();
    return images;
  }, [data]);

  // TODO RENDER LOADING SCREEN

  // TODO RENDER ERROR SCREEN

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <Error />
        ) : (
          <CardList cards={formattedData} />
        )}
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && (
          <Flex mt="1rem">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
            </Button>
          </Flex>
        )}
      </Box>
    </>
  );
}
