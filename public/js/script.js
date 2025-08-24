// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


//for flash messages :

setTimeout(()=>{
  const flash = document.querySelector(".flash-message");
  if(flash){
    flash.style.transition = "opacity 0.5s ease";  //change opacity in 0.5sec
    flash.style.opacity = '0';                  
    setTimeout(()=>{flash.remove()},500);  //TO remove from DOM 
  }
},2000);
