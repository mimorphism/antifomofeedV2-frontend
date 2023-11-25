import { createStyles, Card, Image, Text, AspectRatio,CloseButton,Flex } from '@mantine/core';
import { useState } from 'react';


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
                       
  return (
    <Card
      p="md" radius="md" component="a" href="#" className={classes.card}
    ><Flex justify="flex-end">
          <CloseButton title="Close popover" size="xl" iconSize={20} onClick={() => removeItem(feedItem.itemId)}/>
</Flex>
      <AspectRatio ratio={16 / 9}>
        <Image withPlaceholder src={feedItem.image} onClick={() => window.open(feedItem.url)} />
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