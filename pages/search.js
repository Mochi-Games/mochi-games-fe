import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography } from '@mui/material';

const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.light, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.25),
  },
  marginRight: 700,
  marginLeft: 0,
  marginTop: 20,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function search() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <SearchBar>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          //   onKeyPress={handleKeyPress}
        />
      </SearchBar>
    </Box>
  );
}

export default search;

// export async function getServerSideProps(context) {
//   const { id } = context.params;
//   const res = await axios(`${server}/?search='tomb raider'?&ey=${API_KEY}`);
//   const game = res.data;
//   const allReviewsGame = await prisma.review.findMany({
//     // orderBy: {
//     //   createdAt: 'desc',
//     // },
//     where: { gameId: game.id },
//     // include: {
//     //   select: {
//     //     user: true,
//     //   },
//     // },
//     //include: user
//   });
//   console.log('allreviews', allReviewsGame);
//   return {
//     props: {
//       game,
//       allReviewsGame: JSON.parse(JSON.stringify(allReviewsGame)),
//     },
//   };
// }
