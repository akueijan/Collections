
document.addEventListener('DOMContentLoaded', function() {
  
  function navMenu_Init() {
    var body = document.querySelector('body');
    var dObj = document.querySelector('nav');
    var dMenubtn = document.querySelector('nav .nav-btn');
    var dAllLink = document.querySelectorAll('nav .nav-menu a');
    var dMenuClose = document.querySelector('nav .nav-close');

    dMenubtn.addEventListener('click', function() {
      dObj.classList.toggle('nav--active');
      body.classList.toggle('_freeze');
    })

    // dMenuClose.addEventListener('click', function() {
    //   dObj.classList.remove('nav--active');
    //   body.classList.remove('_freeze');
    // })

    for(let i=0; i<dAllLink.length; i++) {
      dAllLink[i].addEventListener('click', function() {
        dObj.classList.remove('nav--active');
        body.classList.remove('_freeze');
      })
    }
  }
  navMenu_Init();

});

