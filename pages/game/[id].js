import {
  Container,
  Rating,
  Typography,
  Card,
  CardMedia,
  IconButton,
  Box,
  Modal,
  Tooltip,
  ToggleButton,
} from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CreateIcon from '@mui/icons-material/Create';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { server } from '../../utils';
import { useState } from 'react';
import styles from '/styles/Home.module.css';
import { SessionProvider, useSession } from 'next-auth/react';
import ReviewComp from '../../components/ReviewComp';

const API_KEY = process.env.RAWG_API_KEY;

const prisma = new PrismaClient();

function GamePage({ game, allGameReviews }) {
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({});
  const session = useSession();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const status = session.status;

  const [favorite, setFavorite] = useState(false);
  const [selected, setSelected] = useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  async function saveReview(e) {
    e.preventDefault();
    console.log(formData);
    const response = await fetch('/api/review', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    return await response.json();
  }

  function refreshPage() {
    window.location.reload(false);
  }

  console.log('gamepageresults', game);
  console.log('review', allGameReviews);

  return (
    <>
      <SessionProvider session={session}>
        <div>
          <div className={styles.image_wrapper}>
            <img src={game.background_image_additional} />
          </div>
          <Container sx={{ display: 'flex', paddingTop: 50 }}>
            <Card sx={{ maxWidth: 300, maxHeight: 300 }}>
              <CardMedia
                component="img"
                height="300"
                image={game.background_image}
                alt={game.slug}
              />
              <Rating
                name="simple-controlled"
                // precision={0.5}
                value={value}
                onChange={(e, newValue) => {
                  setValue(newValue);
                  // setFormData({ ...formData, rating: +e.target.value });
                }}
              />
              <div display="flex" justifycontent="space-between">
                <Tooltip title="Favorite">
                  <ToggleButton
                    color="error"
                    value="heart"
                    selected={favorite}
                    onClick={() => {
                      setFavorite(!favorite);
                      // setFormData({ ...formData, favorite: true });
                    }}
                  >
                    <FavoriteIcon sx={{ '&:hover': { color: 'red' } }} />
                  </ToggleButton>
                </Tooltip>
                <Tooltip title="Played">
                  <ToggleButton
                    color="success"
                    value="check"
                    selected={selected}
                    onClick={() => {
                      setSelected(!selected);
                      // setFormData({ ...formData, played: true });
                    }}
                  >
                    <CheckCircleOutlineOutlinedIcon
                      sx={{ '&:hover': { color: 'green' } }}
                    />
                  </ToggleButton>
                </Tooltip>
                <Tooltip title="Review">
                  <IconButton onClick={handleOpen}>
                    <CreateIcon sx={{ '&:hover': { color: 'blue' } }} />
                  </IconButton>
                </Tooltip>
              </div>
            </Card>
            <Container sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h3" gutterBottom component="div">
                {game.name}
              </Typography>
              <Typography variant="h6">
                Released: {game.released} by {game.publishers[0].name}
              </Typography>
              <Typography variant="p" gutterBottom component="div">
                {game.description_raw}
              </Typography>
            </Container>
          </Container>
          <Container>
            <div>
              <Rating name="read-only" value={game.rating} readOnly />
              <Typography variant="p" gutterBottom component="div">
                {game.rating} avg
              </Typography>
            </div>
          </Container>
          {status === 'authenticated' ? (
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-reviewform"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <form className={styles.reviewform} onSubmit={saveReview}>
                  <Rating
                    name="simple-controlled"
                    value={value}
                    onChange={(e, newValue) => {
                      setValue(newValue),
                        setFormData({ ...formData, rating: +e.target.value });
                    }}
                  />
                  <ToggleButton
                    color="error"
                    value="heart"
                    selected={favorite}
                    onClick={() => {
                      setFavorite(!favorite),
                        setFormData({ ...formData, favorite: favorite });
                    }}
                  >
                    <FavoriteIcon sx={{ '&:hover': { color: 'red' } }} />
                  </ToggleButton>
                  <textarea
                    name="comment"
                    id=""
                    cols="30"
                    rows="10"
                    placeholder="comment"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        comment: e.target.value,
                        gameId: game.id,
                        email: session.data.user.email,
                        id: session.data.user.id,
                      })
                    }
                  />
                  <button type="submit" onClick={refreshPage}>
                    Add review
                  </button>
                </form>
              </Box>
            </Modal>
          ) : (
            <Modal open={open} onClose={handleClose}>
              <Box sx={style}>
                <p>Please log in to leave a review!</p>
              </Box>
            </Modal>
          )}
        </div>
        <Container sx={{ padding: 20 }}>
          <Typography variant="h5">Recent Reviews:</Typography>
          {allGameReviews.map((review, i) => (
            <ReviewComp review={review} key={i} />
          ))}
        </Container>
      </SessionProvider>
    </>
  );
}

export default GamePage;

export async function getServerSideProps(context) {
  console.log(context);
  const { id } = context.params;
  const res = await axios(`${server}/${id}?key=${API_KEY}`);
  const game = res.data;
  const allGameReviews = await prisma.review.findMany({
    where: { gameId: game.id },
  });
  console.log('allreviews', allGameReviews);
  return {
    props: {
      game,
      allGameReviews: JSON.parse(JSON.stringify(allGameReviews)),
    },
  };
}
