
import "./init"
import "./global.css"
import { Text, Space, Container, Center, ScrollArea, MantineProvider, rem, LoadingOverlay, Alert, createStyles, Flex } from "@mantine/core";
import { useState, useEffect } from "react";
import { FeedItem } from "./FeedItem";
import useAxios from './useAxios';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { CaughtUp } from "./CaughtUp";
import { Stats } from "./Stats";
import axios from "axios";
import {StompSessionProvider} from "react-stomp-hooks";

export default function App() {

  const useStyles = createStyles(() => ({

    bummer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      msTransform: 'translate(-50%, -50%)',
      whiteSpace: 'nowrap'
    },
  }));
  const { classes } = useStyles();


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data: rawFeed, isPending } = useAxios(`getFeed?page=${currentPage}`, 'get');
  const [feed, setFeed] = useState([]);
  const [initialStats, setInitialStats] = useState({});
  const [error, setError] = useState("");
  const [hideHeader, setHideHeader] = useState(false);

const WS_URL = 'ws://192.168.0.2:8081/stats';



  const incrementPage = () => {

    if (feed.length != 0 && currentPage <= totalPages) {
      const incrementPage = currentPage + 1;
      setCurrentPage(incrementPage);
    }
  }
  const scrollRef = useBottomScrollListener(incrementPage);
  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });


  useEffect(() => {
    if (rawFeed) {
      setFeed(existing => [...existing, ...rawFeed.content]);
      if (rawFeed.currentPage == 1) {
        setTotalPages(rawFeed.totalPages);
        setInitialStats(rawFeed.initialStatsUpdate)
      }
      setCurrentPage(rawFeed.currentPage);
    } else {
      setError("Server not reachable :(");
    }
  }, [rawFeed]);


  const removeItem = (id) => {

    setTimeout(() => {
      setInProgress((prev) => prev + 1);
      setFeed(feed.filter(item => item.itemId !== id));
      axios.put(`http://192.168.0.2:8081/api/markForDeletion?itemid=${id}`)
        .then(updateTotalViewAllTime)
        .catch(setError("Server not reachable :("));
    }, 2000);

  };

  function WelcomeHeader(){

    return (
      <Center>
            <Text size="xl" weight={800}>
              Welcome to Anti Fomo Feed!
            </Text>
          </Center>
    );

  }

  useEffect(() => {
    if (scrollPosition.y >= 110) {
      setHideHeader(true);
    }else{
      setHideHeader(false);
    }
  }, [scrollPosition]);



  return (
    <MantineProvider
      theme={{ colorScheme: 'dark'}}
      withGlobalStyles>
      {!rawFeed ?
        <Alert
          className={classes.bummer}
          title="Bummer!"
          color="red">
          {error}
        </Alert>
        :
        <div>
          <Space h={"xs"} />
          { !hideHeader && 
          <WelcomeHeader/>
          }
          <StompSessionProvider
      url={WS_URL}
      debug={(str) => {
        console.log(str);
      }}
    >
          <Container size={"xl"} mt={'0.5`` em'}>
            {feed && feed.length > 0
              ?
              <>
              <Stats linksOnPage={feed.length} initialStats ={initialStats}/>
              <ScrollArea type="always" scrollbarSize={20} 
                style={{ height: 'calc(100vh - 110px)' }}
                viewportRef={scrollRef}
                onScrollPositionChange={onScrollPositionChange}>
                <LoadingOverlay
                  loaderProps={{
                    size: '200', variant: 'bars'

                  }} visible={isPending} />
                  
  
                {/* <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 3 }]}> */}
                <Flex
                  mih={50}
                  bg="rgba(0, 0, 0, .3)"
                  gap="md"
                  justify="flex-start"
                  align="center"
                  direction="column"
                  wrap="wrap"
                >
                  {feed.length > 0 && feed.map(feedItem => (
                    <FeedItem key={feedItem.itemId} feedItem={feedItem} removeItem={removeItem} />
                  ))}
                </Flex>
                {/* </SimpleGrid> */}

              </ScrollArea>
              </>
              :
              <CaughtUp />
            }

          </Container>
              </StompSessionProvider>
        </div>
      }

    </MantineProvider >
  );
}
