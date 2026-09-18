/* ==========================================================================
   ISA HERNANDEZ | PHOTO & MAKE UP
   Portfolio Filter & Interactive Lightbox Viewer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const editorialImgs = document.querySelectorAll('.editorial-gallery-grid img, .polaroid-collage img');
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let activeIndex = 0;
  let activeList = [];

  // Filter functionality
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });

        updateVisibleItems();
      });
    });
  }

  function updateVisibleItems() {
    activeList = Array.from(portfolioItems).filter(item => item.style.display !== 'none');
  }

  if (portfolioItems.length > 0) {
    updateVisibleItems();
  }

  // 2. Lightbox Click Triggers for Portfolio Items
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      updateVisibleItems();
      const idx = activeList.indexOf(item);
      if (idx !== -1) {
        openPortfolioLightbox(idx);
      }
    });
  });

  function openPortfolioLightbox(index) {
    if (!lightboxModal || activeList.length === 0) return;
    activeIndex = index;
    const targetItem = activeList[activeIndex];
    const imgEl = targetItem.querySelector('img');
    const titleEl = targetItem.querySelector('.portfolio-item-title');
    const catEl = targetItem.querySelector('.portfolio-item-cat');

    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || 'Fotografía de Isa Hernandez';
    const title = titleEl ? titleEl.textContent.trim() : '';
    const cat = catEl ? catEl.textContent.trim() : '';
    lightboxCaption.innerHTML = `<div>${title} ${cat ? '· ' + cat : ''}</div><div class="lightbox-counter">${activeIndex + 1} / ${activeList.length}</div>`;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // 3. Lightbox Click Triggers for Home Page (Editorial Grid & Polaroids)
  if (editorialImgs.length > 0 && portfolioItems.length === 0) {
    const homeImgsList = Array.from(editorialImgs);

    homeImgsList.forEach((img, idx) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (e) => {
        e.preventDefault();
        openHomeLightbox(idx, homeImgsList);
      });
    });

    function openHomeLightbox(index, list) {
      if (!lightboxModal) return;
      activeIndex = index;
      activeList = list;
      const targetImg = list[activeIndex];

      lightboxImg.src = targetImg.src;
      lightboxImg.alt = targetImg.alt || 'Isa Hernandez Photo';
      const captionText = targetImg.alt || 'Isa Hernandez Photo & Makeup';
      lightboxCaption.innerHTML = `<div>${captionText}</div><div class="lightbox-counter">${activeIndex + 1} / ${list.length}</div>`;

      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // 4. Modal Navigation & Controls
  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    if (!activeList || activeList.length === 0) return;
    activeIndex = (activeIndex + 1) % activeList.length;
    if (portfolioItems.length > 0) {
      openPortfolioLightbox(activeIndex);
    } else {
      const targetImg = activeList[activeIndex];
      lightboxImg.src = targetImg.src;
      lightboxCaption.innerHTML = `<div>${targetImg.alt || 'Isa Hernandez Photo'}</div><div class="lightbox-counter">${activeIndex + 1} / ${activeList.length}</div>`;
    }
  }

  function showPrev() {
    if (!activeList || activeList.length === 0) return;
    activeIndex = (activeIndex - 1 + activeList.length) % activeList.length;
    if (portfolioItems.length > 0) {
      openPortfolioLightbox(activeIndex);
    } else {
      const targetImg = activeList[activeIndex];
      lightboxImg.src = targetImg.src;
      lightboxCaption.innerHTML = `<div>${targetImg.alt || 'Isa Hernandez Photo'}</div><div class="lightbox-counter">${activeIndex + 1} / ${activeList.length}</div>`;
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Mobile Touch Swipe Navigation
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 45) {
      if (swipeDistance < 0) {
        showNext(); // Swipe Left -> Next
      } else {
        showPrev(); // Swipe Right -> Prev
      }
    }
  }
});
