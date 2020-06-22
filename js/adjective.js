// Wrap every letter in a span
var textWrapper = document.querySelector('.adjective');
adjectives = ["Developer", "Learner", "Problem-solver", "Designer"]
var index = 0;

setText();

function setText()
{
    console.log("setting text: "+adjectives[index])
    textWrapper.innerHTML = adjectives[index]
    index = (index+1)%4
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    startAnimation()
}


function startAnimation()
{
    anime.timeline({loop: false})
    .add({
      targets: '.adjective .letter',
      translateY: [100,0],
      translateZ: 0,
      opacity: [0,1],
      easing: "easeOutExpo",
      duration: 1400,
      delay: (el, i) => 300 + 30 * i
    }).add({
      targets: '.adjective .letter',
      translateY: [0,-100],
      opacity: [1,0],
      easing: "easeInExpo",
      duration: 1200,
      delay: (el, i) => 100 + 30 * i,
      complete:()=>{setText()}
    });
}


