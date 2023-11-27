import { createStyles, Card, Image, Text, AspectRatio,CloseButton,Flex } from '@mantine/core';
import {useStompClient} from "react-stomp-hooks";


const useStyles = createStyles((theme) => ({
  card: {
    width:'30vw',
    transition: 'transform 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: theme.shadows.md,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 600,
  },
}));


export function FeedItem({ feedItem, removeItem }) {
  const { classes } = useStyles();

    const stompClient = useStompClient();


  const updateItemOpened = (itemId) => {
    if(stompClient) {
      //Send Message
      stompClient.publish({
        destination: "/app/updateOpened",
        body: itemId
      });
    }
    else {
      console.error("Error updating opened item: " + itemId);
    }
  };

  const markItemForDeletion = (itemId) => {
    if(stompClient) {
      stompClient.publish({
        destination: "/app/markForDeletion",
        body: itemId
      });
    }
    else {
      console.error("Error updating opened item: " + itemId);
    }
  };
                       
  return (
    <Card
      p="md" radius="md" component="a" href="#" className={classes.card}
    ><Flex justify="flex-end">
          <CloseButton title="Close popover" size="xl" iconSize={20} onClick={() => markItemForDeletion(feedItem.itemId)}/>
</Flex>
      <AspectRatio ratio={16 / 9}>
        <Image withPlaceholder src={feedItem.image} onClick={() => {
          window.open(feedItem.url)
          updateItemOpened(feedItem.itemId); 
        }} 
        />
      </AspectRatio>
      <Text color="dimmed" size="sm" transform="uppercase" weight={700} mt="md">
        {feedItem.domain}
      </Text>
      <Text size="md" className={classes.title} mt={5}>
        {feedItem.title}
      </Text>
      <Text color="dimmed" size="sm" weight={700} mt="xs" lineClamp={2}>
        {feedItem.description}
      </Text>
    </Card>
  );

}