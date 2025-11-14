// Lightweight image lightbox for project screenshots
(function(){
  function ready(fn){ if(document.readyState!=='loading'){fn()} else {document.addEventListener('DOMContentLoaded',fn)} }

  ready(function(){
    // Build overlay
    const overlay=document.createElement('div');
    overlay.id='lb-overlay';
    overlay.className='fixed inset-0 hidden items-center justify-center bg-black/80 z-50 p-4';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');

    overlay.innerHTML = `
      <button id="lb-close" aria-label="Close" class="absolute top-3 right-3 p-2 rounded-md bg-black/60 text-white hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.361a1 1 0 111.414 1.414L13.414 10.586l4.361 4.361a1 1 0 01-1.414 1.414L12 12l-4.361 4.361a1 1 0 01-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 010-1.414z"/></svg>
      </button>
      <button id="lb-prev" aria-label="Previous" class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <figure class="max-w-[95vw] max-h-[90vh]">
        <img id="lb-img" alt="Preview" class="max-w-[95vw] max-h-[80vh] object-contain rounded-lg shadow-2xl" />
        <figcaption id="lb-cap" class="mt-3 text-center text-sm text-gray-200"></figcaption>
      </figure>
      <button id="lb-next" aria-label="Next" class="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
      </button>
    `;

    document.body.appendChild(overlay);

    const imgEl = overlay.querySelector('#lb-img');
    const capEl = overlay.querySelector('#lb-cap');
    const btnClose = overlay.querySelector('#lb-close');
    const btnPrev = overlay.querySelector('#lb-prev');
    const btnNext = overlay.querySelector('#lb-next');

    let gallery = [];
    let currentIndex = 0;

    function show(index){
      if(!gallery.length) return;
      currentIndex = (index+gallery.length)%gallery.length; // wrap
      const item = gallery[currentIndex];
      imgEl.src = item.src;
      imgEl.alt = item.alt || 'Preview';
      capEl.textContent = item.caption || '';
    }

    function openFor(target){
      // Build gallery within closest article (fallback to #projects)
      const scope = target.closest('article') || target.closest('#projects') || document;
      const candidates = Array.from(scope.querySelectorAll('img'))
        .filter(img=> img.width >= 200 || img.classList.contains('object-cover'));
      gallery = candidates.map(img=>({
        el: img,
        src: img.currentSrc || img.src,
        alt: img.getAttribute('alt')||'',
        caption: (img.closest('figure')?.querySelector('figcaption')?.textContent||'').trim()
      }));
      currentIndex = Math.max(0, candidates.indexOf(target));
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
      document.body.style.overflow='hidden';
      show(currentIndex);
    }

    function close(){
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
      document.body.style.overflow='';
      imgEl.removeAttribute('src');
      capEl.textContent='';
      gallery = [];
    }

    // Show zoom cursor on screenshots
    document.querySelectorAll('#projects img').forEach(img=>{
      img.classList.add('cursor-zoom-in');
    });

    // Events
    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', ()=> show(currentIndex-1));
    btnNext.addEventListener('click', ()=> show(currentIndex+1));
    overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });
    document.addEventListener('keydown', (e)=>{
      if(overlay.classList.contains('hidden')) return;
      if(e.key==='Escape') close();
      if(e.key==='ArrowLeft') show(currentIndex-1);
      if(e.key==='ArrowRight') show(currentIndex+1);
    });

    // Delegate click on screenshots
    document.addEventListener('click', function(e){
      const t = e.target;
      if(!(t instanceof Element)) return;
      if(t.tagName==='IMG' && (t.closest('#projects') || t.closest('#my-projects'))){
        e.preventDefault();
        openFor(t);
      }
    }, true);
  });
})();
