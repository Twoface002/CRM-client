document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
  
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const speed = 200; // lower is faster
        const increment = target / speed;
  
        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(updateCount, 10);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };
  
      updateCount();
    });
  });
  