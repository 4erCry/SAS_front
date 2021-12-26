import React from "react";
import { Grid, Image } from "semantic-ui-react";

const HousePage = () => {
  return (
    <Grid>
      <Grid.Column>
        <label> Название дома </label>
        <Grid.Row columns={2}>
          <Image src="https://media-cdn.tripadvisor.com/media/photo-s/13/d8/ea/1b/a-room-at-the-beach.jpg" />

          <Image src="https://media-cdn.tripadvisor.com/media/photo-s/13/d8/ea/1b/a-room-at-the-beach.jpg" />
        </Grid.Row>
        <Grid.Row columns={2}>
          <Image src="https://media-cdn.tripadvisor.com/media/photo-s/13/d8/ea/1b/a-room-at-the-beach.jpg" />

          <Image src="https://media-cdn.tripadvisor.com/media/photo-s/13/d8/ea/1b/a-room-at-the-beach.jpg" />
        </Grid.Row>
        <Grid.Row columns={2}>
          <Image src="https://media-cdn.tripadvisor.com/media/photo-s/13/d8/ea/1b/a-room-at-the-beach.jpg" />

          <Image src="https://media-cdn.tripadvisor.com/media/photo-s/13/d8/ea/1b/a-room-at-the-beach.jpg" />
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

export default HousePage;
