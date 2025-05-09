  // Mobile menu toggle
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.getElementById('navLinks');
  
  mobileMenu.addEventListener('click', () => {
      navLinks.classList.toggle('show');
  });
  
  // FAQ toggle
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
          // Close all other items
          faqItems.forEach(otherItem => {
              if (otherItem !== item) {
                  otherItem.classList.remove('active');
              }
          });
          
          // Toggle current item
          item.classList.toggle('active');
      });
  });