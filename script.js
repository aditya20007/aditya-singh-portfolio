/* ============================================================
   ADITYA SINGH PORTFOLIO — script.js
============================================================ */

/* ---- Custom Cursor ---- */
const cursorDot  = document.createElement('div');
const cursorRing = document.createElement('div');
cursorDot.className  = 'cursor-dot';
cursorRing.className = 'cursor-ring';
document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);

let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .project-card, .skill-cat-card, .cert-card, .contact-link-card, .glass-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
});

/* ---- Navbar scroll shrink ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

/* ---- Mobile hamburger ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const bars = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    bars[0].style.transform = 'translateY(7px) rotate(45deg)';
    bars[1].style.opacity   = '0';
    bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
  }
});
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
  });
});

/* ---- Active nav on scroll ---- */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  links.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

/* ---- Typed role animation ---- */
const roles = ['Data Analyst', 'ML Engineer', 'Power BI Developer', 'Python Developer', 'Data Scientist'];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-role');

function typeRole() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { deleting = true; setTimeout(typeRole, 1800); return; }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  }
  setTimeout(typeRole, deleting ? 60 : 110);
}
setTimeout(typeRole, 800);

/* ---- Scroll Reveal ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), parseFloat(entry.target.style.getPropertyValue('--delay') || 0) * 1000);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ---- Animated stat counters ---- */
const statNums = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = +e.target.dataset.target;
      let current = 0;
      const step = target / 60;
      const interval = setInterval(() => {
        current += step;
        if (current >= target) { e.target.textContent = target; clearInterval(interval); return; }
        e.target.textContent = Math.floor(current);
      }, 25);
      statObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => statObserver.observe(n));

/* ---- Skill bars animation ---- */
const sbObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sb-fill').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, i * 120);
      });
      sbObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
const sbGroup = document.querySelector('.skill-bar-group');
if (sbGroup) sbObserver.observe(sbGroup);

/* ---- Tilt card effect ---- */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = (-y / rect.height * 8).toFixed(2);
    const rotY = (x / rect.width * 8).toFixed(2);
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- Contact form ---- */
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      successMsg.classList.add('show');
      form.reset();
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.disabled = false;
        successMsg.classList.remove('show');
      }, 3500);
    }, 1200);
  });
}

/* ---- Profile photo upload hint ---- */
const profileImg = document.getElementById('profile-img');
if (profileImg) {
  profileImg.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => { profileImg.src = ev.target.result; };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  });
  profileImg.title = 'Click to change photo';
  profileImg.style.cursor = 'pointer';
}

/* ---- Floating background particles (Hero) ---- */
function createHeroParticles() {
  const hero = document.getElementById('home');
  if (!hero) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 6 + 3;
    p.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      background:rgba(37,99,235,${Math.random() * 0.15 + 0.05});
      border-radius:50%;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      pointer-events:none;
      animation: particleFloat ${Math.random() * 8 + 6}s ease-in-out ${Math.random() * 5}s infinite alternate;
    `;
    hero.appendChild(p);
  }
}
const pStyle = document.createElement('style');
pStyle.textContent = `
  @keyframes particleFloat {
    from { transform: translate(0,0) scale(1); opacity:.4; }
    to   { transform: translate(${Math.random()*40-20}px, ${Math.random()*40-20}px) scale(1.3); opacity:.1; }
  }
`;
document.head.appendChild(pStyle);
createHeroParticles();

/* ---- Page load animation ---- */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  });
});