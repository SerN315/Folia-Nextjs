$(function () {
  
    fetch('_topNav.html')
    .then(response => response.text())
    .then(html => {
      $('#topNav').html(html);
    });

    fetch('_footer.html')
    .then(response => response.text())
    .then(html => {
      $('#footer').html(html);
    });
  });
  
$(function() {
    const wrapper = $('.wrapper');
    const loginLink = $('.login-link');
    const registerLink = $('.register-link');
    const closeIcon = $('.icon-close');
    const popup = $('.avaicon');

    registerLink.on('click', function() {
      wrapper.removeClass('active');
    });
  
    loginLink.on('click', function() { 
      wrapper.addClass('active');
    });
  
    popup.on('click', function() {
      wrapper.addClass('active-popup');
    });
  
    closeIcon.on('click', function() {
      wrapper.removeClass('active-popup');
    });
  });

