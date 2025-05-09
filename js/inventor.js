        // Toggle Accordion
        document.addEventListener('DOMContentLoaded', function() {
          const accordionHeaders = document.querySelectorAll('.accordion-header');
          
          accordionHeaders.forEach(header => {
              header.addEventListener('click', function() {
                  this.classList.toggle('active');
                  const content = this.nextElementSibling;
                  
                  if (this.classList.contains('active')) {
                      content.style.maxHeight = content.scrollHeight + 'px';
                  } else {
                      content.style.maxHeight = '0';
                  }
                  
                  // Close other accordions
                  accordionHeaders.forEach(otherHeader => {
                      if (otherHeader !== this) {
                          otherHeader.classList.remove('active');
                          otherHeader.nextElementSibling.style.maxHeight = '0';
                      }
                  });
              });
          });
          
          // 3D Animation Effect
          const cards = document.querySelectorAll('.feature-card, .step-content, .tip-card, .support-card, .testimonial, .stat');
          
          window.addEventListener('scroll', function() {
              cards.forEach(card => {
                  const cardPosition = card.getBoundingClientRect().top;
                  const screenPosition = window.innerHeight / 1.3;
                  
                  if (cardPosition < screenPosition) {
                      card.style.opacity = '1';
                      card.style.transform = 'translateY(0)';
                  }
              });
          });
          
          // Add auto-click to first accordion for initial display
          setTimeout(() => {
              accordionHeaders[0].click();
          }, 1000);
      });