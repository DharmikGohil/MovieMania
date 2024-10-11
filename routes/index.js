var express = require('express');
var router = express.Router();
const request = require('request');


const urlMoviesData = `https://raw.githubusercontent.com/DharmikGohil/temp/refs/heads/main/moviesData.json`;

// this tells browesr to load imeges from external source which is not from localhost origin
router.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
  next();
}); 

// first let's get moviesData and store in res.locals
router.use((req, res, next) => {
  request(urlMoviesData,(error, response, body) => {
    if(error){
      res.render('error',{
        error
      })
    }
    else{
      const movieData = JSON.parse(body)
      res.locals.movieData = movieData;
      next();
    }
  })
})

// home route
router.get('/',(req, res, next) => {
  res.render('index')
})

// single movie search
router.get('/movies/:id',(req, res) => {
  const searchMovieId = req.params.id;
  let foundMovie = null;
    // finding movie with matching id
    for (let i = 0; i < res.locals.movieData.length; i++) {
      const movie = res.locals.movieData[i];
      if (movie._id == searchMovieId) {
        foundMovie = movie;
        break; 
      }
    }
    
    if(foundMovie){
      return res.render('single-movie',{
        movie : foundMovie
      })
    }

    return res.render('noMoviesFound')
})

// serach movie functionality
router.post('/search',(req, res) => {

  const searchCategoryType = req.body.cat;
  const searchedMovie = req.body.movieSearch;
  let matchedMovies = null;

  // if serching by actor name
  if(searchCategoryType === "person"){
     matchedMovies = res.locals.movieData.filter((movie) => {
      for(cast of movie.cast){
        if(cast.toLowerCase().includes(searchedMovie.toLowerCase())){
          return true;
        }
      }
      return false;
    });
  }
  // searching by movie name
   else{
       matchedMovies = res.locals.movieData.filter(movie => movie.title.toLowerCase().includes(searchedMovie.toLowerCase()))
      }

    if(matchedMovies.length != 0){
      return  res.render('index',{
        movieData : matchedMovies,
      })
    }
    return res.render('noMoviesFound')
})

router.all('/*',(req,res)=>{
  res.render('404')
})

module.exports = router;