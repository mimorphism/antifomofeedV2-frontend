import { useState } from "react";

import { createStyles, Text, Card, RingProgress, Group } from '@mantine/core';
import {useSubscription} from "react-stomp-hooks";


const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    lineHeight: 1,
  },

  lead: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 1,
  },

  inner: {
    display: 'flex',

    [theme.fn.smallerThan(350)]: {
      flexDirection: 'column',
    },
  },

  ring: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',

    [theme.fn.smallerThan(350)]: {
      justifyContent: 'center',
      marginTop: theme.spacing.md,
    },
  },
}));


export function Stats({ linksOnPage }) {
  const { classes, theme } = useStyles();
  const [remaining, setRemaining] = useState(0);
  const [totalViewedAllTime, setTotalViewedAllTime] = useState(0);

    useSubscription("/topic/statsupdate", (message) => {
      var statsUpdate = JSON.parse(message.body)
      setTotalViewedAllTime(statsUpdate.totalViewedAllTime)
      setRemaining(statsUpdate.remaining)
    });

  return (
    <Card withBorder p="xl" radius="md" className={classes.card}>
      <div className={classes.inner}>
        <div>
          <Text size="xl" className={classes.label}>
            Your Stats
          </Text>
          <div>
            <Text className={classes.lead} mt={30}>
              {totalViewedAllTime}
            </Text>
            <Text size="xs" color="dimmed">
              Total viewed all time
            </Text>
          </div>
          <Group mt="lg">
            <div>
              <Text className={classes.label}>{remaining}</Text>
              <Text size="xs" color="dimmed">
                Remaining
              </Text>
            </div>
            <div>
              <Text className={classes.label}>{linksOnPage}</Text>
              <Text size="xs" color="dimmed">
                Links on page
              </Text>
            </div>
          </Group>
        </div>

        <div className={classes.ring}>
          <RingProgress
            roundCaps
            thickness={6}
            size={150}
            sections={[{ value: 
            (remaining == 0 || totalViewedAllTime == 0)  ? 0 : (totalViewedAllTime / remaining) * 100, 
          
            color: theme.primaryColor }]}
            label={
              <div>
                <Text align="center" size="lg" className={classes.label} sx={{ fontSize: 22 }}>
                  {((remaining == 0 || totalViewedAllTime == 0 ) ? 0 : (totalViewedAllTime / remaining) * 100).toFixed(0)}%
                </Text>
                <Text align="center" size="xs" color="dimmed">
                Viewed
                </Text>
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
}